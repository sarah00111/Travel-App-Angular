"use strict";
//Route mehrere Punkte
app.component("rmp", {
    templateUrl: "components/rmp.html",
    controller: "RmpController",
    bindings: {}
});


app.controller("RmpController", function ($log, RespositoryService, $http, ApiService, $timeout) {

    console.log("RmpController()");

    this.adressen = RespositoryService.rep()[0].waypoints;
    this.start = RespositoryService.rep()[0].start;
    this.end = RespositoryService.rep()[0].end;

    this.berechnen = () => {
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
                        mode: "car;fastest"}})
            .then(response => {
                this.zwischenAry = [];
                let waypoints = response.data.results[0].waypoints;
                for (let i = 1; i < waypoints.length - 1; i++) {
                    this.zwischenAry.push(this.adressen.find(obj => obj.strasse + obj.hausnr === waypoints[i].id));
                }

                //richtige Reihenfolge im Repository speichern
                RespositoryService.rep()[0].waypoints = this.zwischenAry;
                this.adressen = RespositoryService.rep()[0].waypoints;
            });


    }

});
