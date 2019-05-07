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

app.controller("AusgabeController", function ($log, $stateParams, Adresse, Route, RespositoryService, $state) {

    $log.debug("AusgabeController()");

    this.index;
    this.route;
    this.$onInit = () => {
        this.index = RespositoryService.getRouteIndex($stateParams.id);
        this.route = RespositoryService.getRoute(this.index);
    }

    this.nextStep = () => {
        $log.debug("next step");
        $state.go("routen-abfolge", {id: $stateParams.id});

        RespositoryService.getRoute($stateParams.id).start = new Adresse("Rennweg", "89b", "1030", "Wien", 48.19072, 16.39729);
        RespositoryService.getRoute($stateParams.id).end = new Adresse("Rennweg", "89b", "1030", "Wien", 48.19072, 16.39729);
    }
});