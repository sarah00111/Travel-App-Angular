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

app.controller("AusgabeController", function ($log, $stateParams, Adresse, Route, RespositoryService) {

    $log.debug("AusgabeController()");

    this.index;
    this.route;
    this.$onInit = () => {
        $log.debug("oninit");
        this.index = RespositoryService.getRouteIndex($stateParams.id);
        this.route = RespositoryService.getRoute(this.index);
    }
});