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

    // $urlRouterProvider.otherwise("/zeit-raum");
});


app.controller("ZeitRaumController", function ($log, $filter) {

    $log.debug("ZeitRaumController()");

    //this.ende => endzeit => HH:MM
    //this.anfang => anfangszeit => HH:MM
    this.changeTime = () => {
        this.anfang = $filter('date')(this.anfang, "shortTime", "UTC");
        this.ende = $filter('date')(this.ende, "shortTime", "UTC");
    }

    this.bestaetigen = () => {
        console.log($filter('date')(this.anfang, "shortTime", "UTC"));
        console.log($filter('date')(this.ende, "shortTime", "UTC"));
    }

});
