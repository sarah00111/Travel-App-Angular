"use strict";

app.component("ausgabe", {
    templateUrl: "components/ausgabe.html",
    controller: "AusgabeController",
    bindings: {}
});
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "ausgabe",
        params: {zeitraum: 0, adressen: []},
        component: "ausgabe"
    });

});

app.controller("AusgabeController", function ($log, $stateParams) {

    $log.debug("AusgabeController()");

    this.$onInit = () => {
        $log.debug("oninit");
        $log.debug("zeitraum", $stateParams.zeitraum);
    }

    this.zeitraum = $stateParams.zeitraum;

});