"use strict";

app.component("r2p", {
    templateUrl: "components/r2p.html",
    controller: "R2pController",
    bindings: {}
});


app.controller("R2pController", function ($log, $http, $filter) {

    $log.debug("R2pController()");

    this.punkt1 = "Leberweg 10";
    this.punkt2 = "Rennweg 89b";

    this.$onInit = function() {

        $http
            .get(`https://geocoder.api.here.com/6.2/geocode.json`,
                {params: {app_id: 'pD7XVGLybCvWiNxfjZqC', app_code: 'Ig88nkteu746bX8mElp77A', city: 'Vienna', street: this.punkt1}})
            .then(response => {
                this.geoPunkt1 = 'geo!'
                    + response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
                    + ','
                    + response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

                return $http
                    .get(`https://geocoder.api.here.com/6.2/geocode.json`,
                    {params: {app_id: 'pD7XVGLybCvWiNxfjZqC', app_code: 'Ig88nkteu746bX8mElp77A',
                        city: 'Vienna', street: this.punkt2}});

            })
            .then(response => {
                this.geoPunkt2 = 'geo!'
                    + response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
                    + ','
                    + response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

                $log.debug(this.geoPunkt1, this.geoPunkt2);


                return $http.get('https://route.api.here.com/routing/7.2/calculateroute.json',
                    {params: {app_id: 'pD7XVGLybCvWiNxfjZqC', app_code: 'Ig88nkteu746bX8mElp77A',
                        waypoint0: this.geoPunkt1, waypoint1: this.geoPunkt2, mode: 'fastest;pedestrian'}});
            })
            .then(response => {
                $log.debug(response.data.response.route[0]);

                this.distanz = response.data.response.route[0].summary.distance;

                this.dauer = response.data.response.route[0].summary.baseTime;
                $log.debug("Distanz: ", this.dauer);
            })
            .catch(response => {
                $log.error("Etwas hat nicht funktioniert");

                let nummer = response.data.code || response.data.status || response.data.cod;
                let text = response.data.message || response.data.statusText;

                $log.debug("Fehler Nummer: ", nummer);
                $log.debug("Fehler Text: ", text);
            });

    };

});
