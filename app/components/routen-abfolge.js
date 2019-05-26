"use strict";

app.component("routenAbfolge", {
    templateUrl: "components/routen-abfolge.html",
    controller: "RoutenAbfolgeController",
    bindings: {}
});


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "routen-abfolge",
        params: {id: null},
        component: "routenAbfolge"
    });

});


app.controller("RoutenAbfolgeController", function ($log, RespositoryService, $stateParams, $http, ApiService, $filter, $state, $timeout) {

    $log.debug("RoutenAbfolgeController()");

    this.index = RespositoryService.getRouteIndex($stateParams.id);

    this.warnungen = "";
    this.noRoute = false;
    this.manyDaysRoute = false;
    this.oneDayRoute = false;
    this.tooManyBP = false;

    this.adressen = RespositoryService.rep()[this.index].waypoints;
    this.start = RespositoryService.rep()[this.index].start;
    this.end = RespositoryService.rep()[this.index].end;

    this.$onInit = () => {
        this.routeBerechnen();
    }

    this.klasse = () => {
        if (!(typeof this.warnungen === 'undefined' || this.warnungen == "")) {
            return 'warnung';
        }
    }

    this.zuUebersicht= () => {
        $state.go("ausgabe", {id: $stateParams.id});
    }

    this.routeBerechnen = () => {
        /*
        destinations ... Variable in den get-Parameter für die einzelnen BP für die Abfrage zusammen gestellt werden
        zaehler... Varibale, die in destinations verwendet wird, damit die verschiedenen BP unterschiedliche id's in der Abfrage habe (destination1, destination2,...)
            weil die API das verlangt
         */
        let destinations = "";
        let zaehler = 0;
        this.adressen.forEach(function (e) {
            destinations += "&destination" + zaehler++ + "=" + e.strasse + e.hausnr + ";" + e.lat + "," + e.lon;
        });

        $http
            .get(`https://wse.api.here.com/2/findsequence.json?${destinations}`,
                {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(),
                        start: this.start.strasse + ";" + this.start.lat + "," + this.start.lon,
                        end: this.start.strasse + this.start.hausnr + ";" + this.start.lat + "," + this.start.lon,
                        mode: "pedestrian;fastest"}})
            .then(response => {
                /*
                ic... Array mit den, von der API berechneten, Zwischenstops während der Route
                    (beinhaltet pro Eintrag: von-bis, Zeit, Abstand)
                 */
                this.ic = response.data.results[0].interconnections;

                /*
                 zwischenAry... Array, in der die richtige Abfolge der waypoints gespeichert wird
                 */
                this.zwischenAry = [];
                let waypoints = response.data.results[0].waypoints;

                for (let i = 1; i < waypoints.length - 1; i++) {
                    this.zwischenAry.push(this.adressen.find(obj => obj.strasse + obj.hausnr === waypoints[i].id));
                }

                //richtige Reihenfolge im Repository speichern
                /*RespositoryService.rep()[this.index].waypoints = this.zwischenAry;
                this.adressen = RespositoryService.rep()[this.index].waypoints;*/


                let sekunden = RespositoryService.rep()[this.index].minuten / 1000;
                let tage = RespositoryService.rep()[this.index].tage;
                let zeitraumAPI = response.data.results[0].time;

                /*kann die Route nicht an einem Tag gegangen werden?
                    wenn ja: Route für mehrere Tage wird berechnet
                    wenn nein: oneDayRoute... Route für den einen Tag wird dem User angezeigt
                 */
                if(sekunden < zeitraumAPI) {
                    let promises = this.getTimeToHotel(this.zwischenAry, this.start);
                    Promise.all(promises)
                        .then(response2 => {
                            this.ergebnis = this.getRouteForDay(response2, tage, sekunden,this.zwischenAry, this.start, this.ic);

                            /*
                            ist ergebnis undefined (bedeutet, das keine Route für keinen Tag berechnet wurde)?
                            wenn ja: noRoute... enabled im HTML einen Bereich, der den User informiert, dass keine Route berechnet werden konnte
                            wenn nein: gibt es zumindest für den ersten Tag (=ergebnis[0]) min 1 BP?
                                wenn ja: manyDaysRoute... zeigt eine Route über mehrere Tage an (siehe HTML)
                                    wurde bei der Erstellung der Route an der letzten Stelle ein leerer Tag eingeplant?
                                        wenn ja: letzten (=leeren) Tag löschen
                                wenn nein: noRoute... enabled im HTML einen Bereich, der den User informiert, dass keine Route berechnet werden konnte
                             */
                            if (typeof this.ergebnis[0] === 'undefined') {
                                this.noRoute = true;
                            }else {
                                if(this.ergebnis[0].length > 0) {
                                    this.manyDaysRoute = true;
                                    if (this.ergebnis[this.ergebnis.length - 1].length == 0) {
                                        this.ergebnis.pop();
                                    }
                                }else {
                                    this.noRoute = true;
                                }

                            }

                            /*$timeout() nötig, weil das HTML gebildet wurde bevor die response von den ganzen promises da war
                            --> variablen aktualisieren
                             */
                            $timeout();
                        })
                        .catch(error => {
                            $log.error("oops, da gabs es wohl einen Fehler, " + error);
                        });


                }else {
                    this.oneDayRoute = true;
                }

            })
            .catch(error => {
                let gleicheBP = RegExp('Waypoint id .* is not unique');
                let falscheAPICredentials = RegExp('.*type="PermissionError".*');
                let dailyRequests = RegExp('Daily limit of 10 requests has been reached');

                if(falscheAPICredentials.test(error.data)) {
                    $log.error("falsche Credentials!");
                    ApiService.newCredentials();
                    this.routeBerechnen();
                }else if(gleicheBP.test(error.data.errors[0])) {
                    $log.error("zwei gleiche Adressen eingegeben!");
                }else if(dailyRequests.test(error.data.errors[0])) {
                    $log.error("zu viele Requests!");
                    ApiService.newCredentials();
                    this.routeBerechnen();
                }else {
                    $log.error("ein Fehler ist aufgetreten: ", error);
                }
            });


    }

    /*
    Funktion, um die Uhrzeiten aller Zwischenstops für eine Route über 1 Tag auszurechnen
    FUNKTIONIERT
     */
   /* this.getUhrzeiten = () => {
        this.uhrzeiten = [];
        let summe = this.uhrzeit.getTime();
        this.ic.forEach(ic => {
            summe += ic.time * 1000;
            this.uhrzeiten.push(summe);
        });
    }*/

   /*
   Funktion, die prüft wie lang es von jedem Besichtigungspunkt zum Hotel braucht und das Ergebnis als Array von Promises zurückliefert
    */
    this.getTimeToHotel = (bp, start) => {
        //geo!-Schreibweise wird von der API für jeden Waypoint verlangt
        let geoPunkt1 = 'geo!' + start.lat + ',' + start.lon;
        let allePromises = [];
        for (let punkt of bp) {
            let geoPunkt2 = 'geo!' + punkt.lat + ',' + punkt.lon;
            allePromises.push($http.get('https://route.api.here.com/routing/7.2/calculateroute.json',
                {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(),
                        waypoint0: geoPunkt1, waypoint1: geoPunkt2, mode: 'fastest;pedestrian'}}));
        }
        return allePromises;
    }

    /*
    Funktion, die eine Route über mehrere Tage berechnet
     */
    this.getRouteForDay =(response, tage, sekunden, bp, start, ic) => {
        /*
        ergebnis... zweidimensionales Array
        erste Dimension: entspricht Tag (z.B. ergebnis[0] = ertser Tag)
        zweite Dimension: entspricht den einzelnen BP pro Tag (z.B. ergebnis[0][0] = erster Besichtigungspunkt am ersten Tag)
        enthält NICHT Start- & Endpunkte, weil die sowieso immer gleich sind
         */
        var ergebnis = [];

        /*index für die Arrays: bp, ic & allePromises
            wird am Anfang auf -1 gesetzt, weil es in der loop am Anfang erhöht wird
         */
        let aryIndex = -1;
        /* dauer...Summe aus der Zeit, um zum BP zu gelangen + der Zeit, die man bräuchte, um von dort wieder zum Hotel zu fahren*/
        var dauer = 0;
        for(let i = 0; i < tage; i++) {
            let sekundenAmTag = 0;

            /*prüft, ob am letzten Tag keine Route zustande gekommen ist
            wenn ja erniedrigt es den index des ergebnis array, damit der Tag neu geplantz wird
             */
            if(i - 1 > -1 && ergebnis[i - 1].length == 0) {
                i--;
            }

            ergebnis[i] = [];
            while(sekundenAmTag <= sekunden){
                /* zieht von den sekundenAmTag den Weg vom BP zum Hotel ab, weil man evt noch ein anderen BP besuchen wird
                    (nicht unbedingt direkt danach zum Hotel fährt)
                 und fügt den BP zum Array für die Route an diesem Tag hinzu
                 */
                if(aryIndex > -1 && sekundenAmTag !=0) {
                    sekundenAmTag -= response[aryIndex].data.response.route[0].summary.baseTime;
                    ergebnis[i].push(bp[aryIndex]);

                }
                aryIndex++;

                //prüft, ob alle BP eingeplant wurden liefert das Ergebnis zurück
                if(aryIndex == bp.length) {
                    return ergebnis;
                }

                /*
                sekundenAmTag = 0 bedeutet, dass es der 1. BP für diesen Tag ist --> Dauer für diesen BP ist also der Weg vom Hotel zum BP
                    und wieder zum Hotel zurück
                sekunden != 0 bedeutet, dass die Dauer für diesen BP der Weg vom letzten BP zu diesem (=interconnection time)
                    + die Zeit zurück zum Hotel ist
                 */
                if(sekundenAmTag == 0) {
                    dauer =  2 * response[aryIndex].data.response.route[0].summary.baseTime;
                }else {
                    dauer =  ic[aryIndex].time + response[aryIndex].data.response.route[0].summary.baseTime;
                }

                sekundenAmTag += dauer;
            };
            /*wenn der Weg zu einem einzelnen BP & wieder zum Hotel zu lange für einen Tag ist, ist an der Stelle der Funktion die Dauer
            für diesen gesamten Tag gleich wie für den einzelnen BP
            wenn dem nicht der Fall ist wird der aryIndex verringert, damit der BP am nächsten Tag eingeplant wird
            wenn doch dann wird der User darauf hingewiesen, weil dieser BP dann gar nicht besichtigt werden kann
             */
            if(sekundenAmTag != dauer) {
                aryIndex--;
            }else {
                this.warnungen += "Folgender Besichtigungspunkt ist zu weit von ihrem Hoten entfernt, um ihn in der gegebenen Zeitspanne zu besuchen: <b>"
                    + bp[aryIndex].strasse + " " + bp[aryIndex].hausnr + "</b><br>";
            }

        }

        /*
        wenn der aryIndex kleiner als bp.length ist bedeutet das, dass nicht alle BP eingeplant wurden
        der User wird informiert, dass es zeitlich nicht möglich war diese BP einzuplanen
         */
        if(aryIndex < bp.length) {
            this.warnungen += "<br> Folgende Besichtigungspunkte konnten nicht mehr eingeplant werden, weil nicht genug Zeit war: ";
            this.warnungen += "<ul>";
            /*
            aryIndex + 1, weil der aryIndex angibt, welche BP schon eingeplant wurden (für diese BP braucht man also keine Warnung mehr)
             */
            for(let i = aryIndex + 1; i < bp.length; i++) {
                this.warnungen += "<li>" + bp[i].strasse + " " + bp[i].hausnr + "</li>";
            }
            this.warnungen +="</ul>";
            return ergebnis;
        }


    }
});
