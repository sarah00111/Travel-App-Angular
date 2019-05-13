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

    this.anfang = new Date(1, 1, 1970, 1);
    this.ende = new Date(1, 1, 1970, 3, 1);

    this.nextStep = () => {
        if(this.ende && this.anfang) {
            return false;
        }
        return true;
    }

    this.route = () => {
        this.id = RespositoryService.getId();
        //@Basem TODO: 4 durch Methoden-Auruf der Tage berechnet ersetzen
        RespositoryService.newRoute(this.id, this.berechneDauer(), 4);
        $state.go("address", {id: this.id});
    }

    this.berechneDauer = () => {
        return this.ende - this.anfang;
    }

});
