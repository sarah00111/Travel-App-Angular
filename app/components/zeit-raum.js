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


app.controller("ZeitRaumController", function ($log, RespositoryService, $state) {

    $log.debug("ZeitRaumController()");

    this.id;

    this.nextStep = () => {
        if(this.ende && this.anfang) {
            return false;
        }
        return true;
    }

    this.route = () => {
        this.id = RespositoryService.getId();
        RespositoryService.newRoute(this.id, this.berechneDauer());
        $state.go("address", {id: this.id});
    }

    this.berechneDauer = () => {
        return this.ende - this.anfang;
    }

});
