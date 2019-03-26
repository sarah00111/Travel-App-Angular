"use strict";

app.component("addressausgabe", {
    templateUrl: "components/addressausgabe.html",
    controller: "AddressausgabeController",
    bindings: {}
});
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "addressausgabe",
        params: {address: null},
        component: "addressausgabe"
    });

});

app.controller("AddressausgabeController", function ($log) {

    $log.debug("AddressausgabeController()");

});