"use strict";

app.component("r2p", {
    templateUrl: "components/r2p.html",
    controller: "R2pController",
    bindings: {}
});

app.controller("R2pController", function ($log, $http, ApiService) {

    $log.debug("R2pController()");

    this.showErgebnis = false;

    this.punkt1 = "Leberweg 10";
    this.punkt2 = "Rennweg 89b";

    this.routeBerechnen = () => {
        $http
            .get('https://geocoder.api.here.com/6.2/geocode.json',
                {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(), city: 'Vienna', street: this.punkt1}})
            .then(response => {
            this.geoPunkt1 = 'geo!'
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
            + ','
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

        return $http
            .get('https://geocoder.api.here.com/6.2/geocode.json',
                {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(), city: 'Vienna', street: this.punkt2}});

    })
    .then(response => {
            this.geoPunkt2 = 'geo!'
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
            + ','
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;


        return $http.get('https://route.api.here.com/routing/7.2/calculateroute.json',
            {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(),
                waypoint0: this.geoPunkt1, waypoint1: this.geoPunkt2, mode: 'fastest;pedestrian'}});
    })
    .then(response => {
        this.distanz = response.data.response.route[0].summary.distance;
        this.dauer = response.data.response.route[0].summary.baseTime;
    });

        this.showErgebnis = true;


    };

});
