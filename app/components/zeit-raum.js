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
        this.startDate = this.minDate1;
        this.endDate = this.startDate;
        if (this.startDate === undefined || this.endDate === undefined) {
            this.disableButton = true;
        }

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
            this.minDate2 = this.startDate;
            this.endDate = this.startDate;
        }
    }

    this.id;

    this.route = () => {
        this.id = RespositoryService.getId();
        this.dateDiff = Math.floor((Date.UTC(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate()) - Date.UTC(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()) ) /(1000 * 60 * 60 * 24)) + 1;
        RespositoryService.newRoute(this.id, this.berechneDauer(), this.dateDiff);
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
