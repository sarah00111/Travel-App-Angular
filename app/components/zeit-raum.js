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
    this.Date = new Date();
    this.Date2 = new Date();
    this.timeError = "";
    this.disableButton = false;

    this.$onInit = () => {
        if (this.anfang === undefined || this.ende === undefined) {
            //wenn noch keine Variable eingetragen wurde
            this.disableButton = true;
        }
    }

    this.minDate1 = new Date(
        this.Date.getFullYear(),
        this.Date.getMonth(),
        this.Date.getDate()
    );

    this.minDate2 = new Date(
        this.minDate1.getFullYear(),
        this.minDate1.getMonth(),
        this.minDate1.getDate()
    );

    this.compareDate = () => {
        this.endDate = this.endDate | this.minDate2;
        if (this.startDate >= this.endDate) {
            console.log("Startdatum >= Enddatum");
            console.log("Startdatum: " + this.startDate);
            console.log("Enddatum: " + this.endDate);
            this.minDate2 = this.startDate;
            this.endDate = this.startDate;
        } else {
            console.log("Alles gut");
        }
    }

    this.id;

    this.route = () => {
        this.id = RespositoryService.getId();
        RespositoryService.newRoute(this.id, this.berechneDauer());
        $state.go("address", {id: this.id});
    }

    this.berechneDauer = () => {
        if (this.ende - this.anfang < 0) {
            //wenn die Endzeit vor der Anfangszeit ist
            this.disableButton = true;
        } else if (this.ende - this.anfang > 0) {
            //wenn die Endzeit nach der Anfangszeit ist (also korrekt)
            this.disableButton = false;
        } else if (this.ende - this.anfang === NaN) {
            //wenn in einem Input feld was eingetragen wurde, aber in dem anderen nicht
            this.disableButton = true;
        }

        return this.ende - this.anfang;
    }

});
