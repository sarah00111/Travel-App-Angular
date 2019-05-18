"use strict";

app.component("startseite", {
    templateUrl: "components/startseite.html",
    controller: "StartseiteController",
    bindings: {}
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "startseite",
        url: "/startseite",
        component: "startseite"
    });

    $urlRouterProvider.otherwise("/startseite");
});


app.controller("StartseiteController", function ($log) {

    $log.debug("StartseiteController()");

});
