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

    this.id;
    this.index;

    this.$onInit = () => {
        $log.debug("oninit");
        this.id = $stateParams.id;
        this.index = RespositoryService.getRouteIndex(this.id);
        this.waypoint = RespositoryService.getRoute(this.index).waypoints[0];
    }


});