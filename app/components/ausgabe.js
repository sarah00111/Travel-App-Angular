"use strict";

app.component("ausgabe", {
    templateUrl: "components/ausgabe.html",
    controller: "AusgabeController",
    bindings: {}
});
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "ausgabe",
        params: {id: 0},
        component: "ausgabe"
    });

});

app.controller("AusgabeController", function ($log, $stateParams, Adresse, Route) {

    $log.debug("AusgabeController()");

    this.$onInit = () => {
        $log.debug("oninit");
    }


});