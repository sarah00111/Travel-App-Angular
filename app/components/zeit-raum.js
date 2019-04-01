"use strict";

app.component("zeitRaum", {
    templateUrl: "components/zeit-raum.html",
    controller: "ZeitRaumController",
    bindings: {}
});


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "zeit-raum",
        url: "/zeit-raum",
        component: "zeitRaum"
    });

    $urlRouterProvider.otherwise("/zeit-raum");
});


app.controller("ZeitRaumController", function ($log, RespositoryService, Route) {

    $log.debug("ZeitRaumController()");

    this.route = () => {
        this.id = getId();
        RespositoryService.newRoute(this.id, this.berechneDauer());
    }

    this.berechneDauer = () => {
        return this.ende - this.anfang;
    }

});
