"use strict";

app.component("address", {
    templateUrl: "components/address.html",
    controller: "AddressController",
    bindings: {}
});


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "address",
        params: {id: null},
        component: "address"
    });

    /*$urlRouterProvider.otherwise("/address");*/
});


app.controller("AddressController", function ($log, $http, ApiService, Adresse, $stateParams, $state, RespositoryService, $mdToast) {

    //Dummy Parameter für das Debuggen
    //TODO: vor der Review löschen
    this.strasse = "Arsenalstraße";
    this.hausnummer = "1";
    this.plz = "1030";
    this.ort = "Wien";

    let route = RespositoryService.getRoute($stateParams.id);

    this.anzahl = RespositoryService.getRoute($stateParams.id).waypoints.length + 1;

    this.disableNextStep = () => {
        //TODO: this.anzahl -1 ?
        if(RespositoryService.getRoute($stateParams.id).waypoints.length > 0) {
            if(!this.formular.$invalid) {
                return false;
            }
        }
        return true;
    }

    function containsObject(hausnr, strasse) {

        return
    }

    function addressInWaypoints(hausnr, strasse) {
        for (let w in route.waypoints) {
            if(w.hausnr === hausnr) {
                if(w.strasse == strasse) {
                    return true;
                }
            }
        }
        return false;
    }

    this.bestaetigen = (newAdress) => {
        this.fehlermeldungen = "";

        let testIfAlreadyExists = route.waypoints.some(obj => {
            if(obj.hausnr == this.hausnummer && obj.strasse == this.strasse) {
                return true;
            }
            return false;
        });

        //Testen, ob diese Adresse bereits eingegeben wurde
        $log.debug("test ", testIfAlreadyExists);
        if(!testIfAlreadyExists) {
            $http
                .get('https://geocoder.api.here.com/6.2/geocode.json',
                    {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(),
                            street: this.strasse + " " + this.hausnummer, city: this.ort}})
                .then(response => {
                    this.strasseAPI = response.data.Response.View[0].Result[0].Location.Address.Street;
                    this.landAPI = response.data.Response.View[0].Result[0].Location.Address.Country;
                    this.stadtAPI = response.data.Response.View[0].Result[0].Location.Address.City;
                    this.plzAPI = response.data.Response.View[0].Result[0].Location.Address.PostalCode;
                    this.hausNrAPI = response.data.Response.View[0].Result[0].Location.Address.HouseNumber;
                    this.lon = response.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
                    this.lat = response.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

                    if(!this.lon){
                        this.fehlermeldungen = "<p>Die von Ihnen angegebene Adresse kann nicht gefunden werden.</p>"
                        this.fehlermeldungen += "<p><b>Bitte prüfen Sie ihre gesamte Eingabe!</b></p>"
                    }else if(this.ort != this.stadtAPI) {
                        this.fehlermeldungen = "<p>Die von Ihnen eingegebene Straße wurde nicht in dem von Ihnen angegebenen Ort gefunden. </p>"
                        this.fehlermeldungen += "<p>Meinten Sie den Ort <b>" + this.stadtAPI + "</b>? </p>";
                        this.fehlermeldungen += "<p>Wenn ja korrigieren Sie Ihre Eingabe und bestätigen Sie erneut!</p>";
                    }else if(this.plz != this.plzAPI) {
                        this.fehlermeldungen = "<p>Die von Ihnen eingegebene Straße wurde nicht in der von Ihnen angegebenen PLZ gefunden. </p>"
                        this.fehlermeldungen += "<p>Meinten Sie die PLZ <b>" + this.plzAPI + "</b>? </p>";
                        this.fehlermeldungen += "<p>Wenn ja korrigieren Sie Ihre Eingabe und bestätigen Sie erneut!</p>";
                    }else if(this.strasse != this.strasseAPI) {
                        this.fehlermeldungen = "<p>Die von Ihnen eingegebene Straße wurde so nicht gefunden.</p>"
                        this.fehlermeldungen += "<p>Meinten Sie die Straße <b>" + this.strasseAPI + "</b>? </p>";
                        this.fehlermeldungen += "<p>Wenn ja korrigieren Sie Ihre Eingabe und bestätigen Sie erneut!</p>";
                    }else {


                        RespositoryService.newAddressForRoute($stateParams.id, new Adresse(this.strasse, this.hausnummer, this.plz, this.ort, this.lat, this.lon));


                        if(newAdress) {
                            //TODO: Toast auf einer anderen Position?
                            //TODO: hideDelay wieder auf 3000 setzen
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('Ihre Adress-Eingabe wurde gespeichert!')
                                    .position('top right')
                                    .hideDelay(1))
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
                .catch(error => {
                    let falscheAPICredentials = RegExp('.*type="PermissionError".*');

                    if(falscheAPICredentials.test(error.data)) {
                        $log.error("falsche Credentials!");
                        ApiService.newCredentials();
                        this.bestaetigen(newAdress);
                    }else {
                        $log.error("Fehler: ", error);
                        console.log("Die Adresse ergibt keine Rückgabe. Bitte kontrollieren sie Ihre eingabe.");
                        this.fehlermeldungen = "<p>Die von Ihnen angegebene Adresse kann nicht gefunden werden.Wahrscheinlich ist der von Ihnen angegebene Ort nicht korrekt.</p>"
                        this.fehlermeldungen += "<p><b>Bitte prüfen Sie ihre gesamte Eingabe!</b></p>"
                    }
                });

            this.ausgabe= this.strasse + " " + this.plz + " " + this.ort;
        }else {
            this.fehlermeldungen = "Sie haben diese Adresse bereits einmal eingegeben! Bitte geben Sie eine andere Adresse ein!";
        }



    }

});
