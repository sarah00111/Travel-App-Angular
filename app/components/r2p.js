"use strict";

app.component("r2p", {
    templateUrl: "components/r2p.html",
    controller: "R2pController",
    bindings: {}
});


app.controller("R2pController", function ($log, $http, $filter) {

    $log.debug("R2pController()");

    this.showErgebnis = false;

    this.punkt1 = "Leberweg 10";
    this.punkt2 = "Rennweg 89b";

    let app_id = 'PrMutQw0GYIzmsPoWwSV';
    let app_code = '_P73etTNPxern4N6HV69tA';

    this.routeBerechnen = () => {

        $http
            .get(`https://geocoder.api.here.com/6.2/geocode.json`,
                {params: {app_id: app_id, app_code: app_code, city: 'Vienna', street: this.punkt1}})
            .then(response => {
            this.geoPunkt1 = 'geo!'
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
            + ','
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

        return $http
            .get(`https://geocoder.api.here.com/6.2/geocode.json`,
                {params: {app_id: app_id, app_code: app_code, city: 'Vienna', street: this.punkt2}});

    })
    .then(response => {
            this.geoPunkt2 = 'geo!'
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
            + ','
            + response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;


        return $http.get('https://route.api.here.com/routing/7.2/calculateroute.json',
            {params: {app_id: app_id, app_code: app_code,
                waypoint0: this.geoPunkt1, waypoint1: this.geoPunkt2, mode: 'fastest;pedestrian'}});
    })
    .then(response => {

            this.distanz = response.data.response.route[0].summary.distance;

        this.dauer = response.data.response.route[0].summary.baseTime;
        $log.debug("dauer:  ", this.dauer);
    });

        this.showErgebnis = true;


    };

});
