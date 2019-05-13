"use strict";

app.component("uebersicht", {
    templateUrl: "components/uebersicht.html",
    controller: "UebersichtController",
    bindings: {}
});


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "uebersicht",
        params: {id: 0},
        component: "uebersicht"
    });

});


app.controller("UebersichtController", function ($log, $stateParams, Adresse, Route, RespositoryService, $state) {

    $log.debug("UebersichtController()");

    this.index;
    this.route;
    this.$onInit = () => {
        this.index = RespositoryService.getRouteIndex($stateParams.id);
        this.route = RespositoryService.getRoute(this.index);

        this.id = $stateParams.id;
    }

    this.nextStep = () => {
        $log.debug("next step");
        $state.go("routen-abfolge", {id: $stateParams.id});

        console.log(this.auswahl);
        RespositoryService.getRoute($stateParams.id).start = RespositoryService.getRoute($stateParams.id).waypoints[this.auswahl];
        RespositoryService.getRoute($stateParams.id).waypoints.splice(this.auswahl, 1);

        console.log(RespositoryService.getRoute($stateParams.id));

        RespositoryService.getRoute($stateParams.id).end = new Adresse("Rennweg", "89b", "1030", "Wien", 48.19072, 16.39729);
    }

    this.delete = (index) => {
        console.log(RespositoryService.getRoute($stateParams.id).waypoints);
        RespositoryService.getRoute($stateParams.id).waypoints.splice(index, 1);
        console.log("danach");
        console.log(RespositoryService.getRoute($stateParams.id).waypoints);
    }
});
