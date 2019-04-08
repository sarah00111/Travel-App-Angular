"use strict";

app.component("address", {
    templateUrl: "components/address.html",
    controller: "AddressController",
    bindings: {}
});


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "address",
        params: {id: 0},
        component: "address"
    });

    /*$urlRouterProvider.otherwise("/address");*/
});


app.controller("AddressController", function ($log, $http, ApiService, Adresse, $stateParams, $state, RespositoryService) {


    this.$onInit = () => {
        $log.debug("stateparams zeitraum: ", $stateParams.id);
    }
    this.paramsVorbereiten = () => {
        this.bestaetigen();
        RespositoryService.newAddressForRoute($stateParams.id, new Adresse(this.strasse, this.hausnummer, this.plz, this.ort, this.lat, this.lon));
        $state.go("ausgabe", {id: $stateParams.id});
    }


    this.bestaetigen = () => {
        $http
            .get('https://geocoder.api.here.com/6.2/geocode.json',
                {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(),
                    street: this.strasse + " " + this.hausnummer, city: this.ort}})
            .then(response => {
                $log.debug(response);
                this.strasseAPI = response.data.Response.View[0].Result[0].Location.Address.Street;
                this.landAPI = response.data.Response.View[0].Result[0].Location.Address.Country;
                this.stadtAPI = response.data.Response.View[0].Result[0].Location.Address.City;
                this.plzAPI = response.data.Response.View[0].Result[0].Location.Address.PostalCode;
                this.hausNrAPI = response.data.Response.View[0].Result[0].Location.Address.HouseNumber;
                this.lon = response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
                this.lat = response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
                //TODO LAT LON speichern

                if(this.plz == this.plzAPI) {
                    if (this.ort == this.stadtAPI) {
                        console.log("Land: " + this.landAPI + "\nStraße: " + this.strasseAPI + "\nHausnummer: " + this.hausNrAPI + "\nStadt: " + this.stadtAPI +
                            "\nPLZ: " + this.plzAPI + "\nlon: " + this.lon + "\nLat: " + this.lat);
                    } else {
                        console.log("Ihre Adresse stimmt nicht mit dem angegebenen Ort überein.")
                    }
                } else {
                    console.log("Ihre Adresse stimmt nicht mit der angegebenen PLZ überein");
                }

                //console.log(response);
            })
            .catch(response => {
                $log.error("Fehler: " + response);
                console.log("Die Adresse ergibt keine Rückgabe. Bitte kontrollieren sie Ihre eingabe.");
            });
        this.ausgabe= this.strasse + " " + this.plz + " " + this.ort;
    }

});