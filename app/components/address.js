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


app.controller("AddressController", function ($log, $http, ApiService, Adresse, $stateParams, $state, RespositoryService, $mdToast) {


    this.$onInit = () => {
        $log.debug("stateparams zeitraum: ", $stateParams.id);
    }

    this.disableNextStep = () => {
        if(RespositoryService.getRoute($stateParams.id).waypoints.length > 0) {
            if(!this.formular.$invalid) {
                return false;
            }
        }
        return true;
    }

    /*this.paramsVorbereiten = () => {
        this.bestaetigen();
        RespositoryService.newAddressForRoute($stateParams.id, new Adresse(this.strasse, this.hausnummer, this.plz, this.ort, this.lat, this.lon));

    }

    this.newAdress = () => {
        this.bestaetigen();
        RespositoryService.newAddressForRoute($stateParams.id, new Adresse(this.strasse, this.hausnummer, this.plz, this.ort, this.lat, this.lon));
        $state.reload();
    }*/


    this.bestaetigen = (newAdress) => {
        this.fehlermeldungen = "";
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

                $log.debug("response: ", response);
                if(!this.lon){
                    this.fehlermeldungen = "<p>Die von Ihnen angegebene Adresse kann nicht gefunden werden.</p>"
                    this.fehlermeldungen += "<p><b>Bitte prüfen Sie ihre gesamte Eingabe!</b></p>"
                }else if(this.ort != this.stadtAPI) {
                    this.fehlermeldungen = "<p>Die von Ihnen eingegebene Straße wurde nicht in dem von Ihnen angegebenen Ort gefunden. </p>"
                    this.fehlermeldungen += "<p>Meinten Sie den Ort " + this.stadtAPI + "? </p>";
                    this.fehlermeldungen += "<p>Wenn ja korrigieren Sie Ihre Eingabe und bestätigen Sie erneut!</p>";
                }else if(this.plz != this.plzAPI) {
                    this.fehlermeldungen = "<p>Die von Ihnen eingegebene Straße wurde nicht in der von Ihnen angegebenen PLZ gefunden. </p>"
                    this.fehlermeldungen += "<p>Meinten Sie die PLZ " + this.plzAPI + "? </p>";
                    this.fehlermeldungen += "<p>Wenn ja korrigieren Sie Ihre Eingabe und bestätigen Sie erneut!</p>";
                }else {
                    RespositoryService.newAddressForRoute($stateParams.id, new Adresse(this.strasse, this.hausnummer, this.plz, this.ort, this.lat, this.lon));


                    if(newAdress) {
                        //TODO: Toast auf einer anderen Position?
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Ihre Adress-Eingabe wurde gespeichert!')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            }).catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.'
                            );
                        });

                        $state.reload();
                    }else {
                        $state.go("ausgabe", {id: $stateParams.id});
                    }

                }

                //console.log(response);
            })
            .catch(response => {
                $log.error("Fehler: " + response);
                console.log("Die Adresse ergibt keine Rückgabe. Bitte kontrollieren sie Ihre eingabe.");
                this.fehlermeldungen = "<p>Die von Ihnen angegebene Adresse kann nicht gefunden werden.Wahrscheinlich ist der von Ihnen angegebene Ort nicht korrekt.</p>"
                this.fehlermeldungen += "<p><b>Bitte prüfen Sie ihre gesamte Eingabe!</b></p>"
            });
        this.ausgabe= this.strasse + " " + this.plz + " " + this.ort;
    }

});
