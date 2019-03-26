"use strict";

app.component("address", {
    templateUrl: "components/address.html",
    controller: "AddressController",
    bindings: {}
});


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "address",
        url: "/address",
        component: "address"
    });

    $urlRouterProvider.otherwise("/address");
});


app.controller("AddressController", function ($log, $http) {

    this.bestaetigen = () => {
        $http
            .get(`https://geocoder.api.here.com/6.2/geocode.json?app_id=PrMutQw0GYIzmsPoWwSV&app_code=_P73etTNPxern4N6HV69tA&searchtext=${this.strasse} ${this.hausnummer}, ${this.plz} ${this.ort}`)
            .then(response => {
                var strasseAPI = response.data.Response.View[0].Result[0].Location.Address.Street;
                var landAPI = response.data.Response.View[0].Result[0].Location.Address.Country;
                var stadtAPI = response.data.Response.View[0].Result[0].Location.Address.City;
                var plzAPI = response.data.Response.View[0].Result[0].Location.Address.PostalCode;
                var hausNrAPI = response.data.Response.View[0].Result[0].Location.Address.HouseNumber;

                if(this.plz == plzAPI) {
                    if (this.ort == stadtAPI) {
                        console.log("Land: " + landAPI + "\nStraße: " + strasseAPI + "\nHausnummer: " + hausNrAPI + "\nStadt: " + stadtAPI +
                            "\nPLZ: " + plzAPI);
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
