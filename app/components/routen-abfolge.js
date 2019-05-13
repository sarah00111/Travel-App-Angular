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


app.controller("RoutenAbfolgeController", function ($log, RespositoryService, $stateParams, $http, ApiService, $filter, $state) {

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

    this.zuUebersicht= () => {
        $state.go("ausgabe", {id: $stateParams.id});
    }

    this.routeBerechnen = () => {
        let destinations = "";
        let zaehler = 0;
        this.adressen.forEach(function (e) {
            destinations += "&destination" + zaehler++ + "=" + e.strasse + e.hausnr + ";" + e.lat + "," + e.lon;
        });

        $http
            .get(`https://wse.api.here.com/2/findsequence.json?${destinations}`,
                {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(),
                        start: this.start.strasse + ";" + this.start.lat + "," + this.start.lon,
                        end: this.end.strasse + this.end.hausnr + ";" + this.end.lat + "," + this.end.lon,
                        mode: "pedestrian;fastest"}})
            .then(response => {
                /*$log.debug("response: ", response);*/

                //BP in richtiger Reihenfolge speichern
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

                /*ist die Dauer der ideale Route größer als der zur Verfügung stehende Zeitraum?
                    wenn ja: der User wird darauf hingewiesen, dass keine Route berechnet wurde, weil zu viele BPangegeben wurden
                    wenn nein: ist der Zeitraum für einen Tag kleiner als die gesamte Route?
                        wenn ja: liefert die Funktion zur Berechnung der Routen an mehreren Tagen min eine Route für den ersten Tag?
                            wenn ja: die Routen für mehrere Tage werden angezeigt
                            wenn nein: der user wird darauf hingewiesen, dass keine Route berechnet werden konnte, weil die Wege vom Hotel zu den BP zu lange für einen Tag sind
                        wenn nein: die gesamte Route wird an einem Tag angezeigt
                 */
                if(sekunden * tage < zeitraumAPI) {
                    $log.debug("keine Route kann berechnet werden & toomManyBP");
                    this.noRoute = true;
                    this.tooManyBP = true;
                }else {
                    if(sekunden < zeitraumAPI) {

                        let promises = this.getTimeToHotel(this.zwischenAry, this.start);
                        Promise.all(promises)
                            .then(response2 => {
                                this.ergebnis = this.getRouteForDay(response2, tage, sekunden,this.zwischenAry, this.start, response.data.results[0].interconnections);
                                if(this.ergebnis[0].length > 0) {
                                    $log.debug("Route für mehrere Tage berechnet");
                                    $log.debug("Warnungen: ", this.warnungen)
                                    this.manyDaysRoute = true;
                                }else {
                                    $log.debug("keine route konnte berechnet werden & ergebnis leer");
                                    $log.debug("Warnungen: ", this.warnungen)
                                    this.noRoute = true;
                                }
                            })
                            .catch(error => {
                                $log.error("oops, da gabs es wohl einen Fehler, " + error);
                            });


                    }else {
                        this.oneDayRoute = true;
                    }
                }

            })
            .catch(error => {
                let gleicheBP = RegExp('Waypoint id .* is not unique');
                let falscheAPICredentials = RegExp('.*type="PermissionError".*');

                if(falscheAPICredentials.test(error.data)) {
                    $log.error("falsche Credentials!");
                    ApiService.newCredentials();
                    this.bestaetigen(newAdress);
                }else if(gleicheBP.test(error.data.errors[0])) {
                    $log.error("zwei gleiche Adressen eingegeben!");
                }else {
                    $log.error("ein Fehler ist aufgetreten: ", error);
                }
            });


    }

    this.getTimeToHotel = (bp, start) => {
        //prüft wie lang es von jedem Besichtigungspunkt zum Hotel braucht
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
      TODO: Variablen im html irgendwie leer
     */

    this.getRouteForDay =(response, tage, sekunden, bp, start, ic) => {
        var ergebnis = [];

        /*index für die Arrays: bp, ic & allePromises
            wird am Anfang auf -1 gesetzt, weil es in der loop am Anfang erhöht wird
         */
        let aryIndex = -1;
        /* dauer...umme aus der Zeit, um zum BP zu gelangen + der Zeit, die man bräuchte, um von dort wieder zum Hotel zu fahren*/
        var dauer = 0;
        for(let i = 0; i < tage; i++) {
            let sekundenAmTag = 0;

            /*prüft, ob am letzten Tag eine Route zustande gekommen ist
            wenn ja erniedrigt es den index des ergebnis array, damit der Tag neu geplantz wird
             */
            if(i - 1 > -1 && ergebnis[i - 1].length == 0) {
                i--;
            }
            ergebnis[i] = [];

            while(sekundenAmTag < sekunden){
                /* zieht von den sekundenAmTag den Weg vom BP zum Hotel ab, weil man ja noch einen BP besuchen will & nicht zum Hotel
                 und fügt den BP zum Array für die Route an diesem Tag hinzu
                 */
                if(aryIndex > -1 && sekundenAmTag !=0) {
                    sekundenAmTag -= response[aryIndex].data.response.route[0].summary.baseTime;
                    ergebnis[i].push(bp[aryIndex]);
                }
                aryIndex++;

                //prüft, wenn alle bp abgearbeitet wurden und liefert das Ergebnis zurück
                if(aryIndex == bp.length) {
                    console.log("Ergebnis am Ende: ", ergebnis);
                    return ergebnis;
                }

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
                this.warnungen += "Folgender Besichtigungspunkt ist zu weit von ihrem Hoten entfernt, um ihn in der gegebenen Zeitspanne zu besuchen: "
                    + bp[aryIndex].strasse + " " + bp[aryIndex].hausnr;
            }

        }

        if(aryIndex < bp.length) {
            this.warnungen += "Folgende BP konnten nicht mehr eingeplant werden, weil nicht genug Zeit war: ";
            this.warnungen += "<ul>";
            for(let punkt in bp) {
                this.warnungen += "<li>" + bp[aryIndex].strasse + " " + bp[aryIndex].hausnr + "</li>";
            }
            this.warnungen +="</ul>";
            return [];
        }


    }
});
