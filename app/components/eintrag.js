"use strict";

app.component("eintrag", {
    templateUrl: "components/eintrag.html",
    controller: "EintragController",
    bindings: {
        obj: "<",
        uhrzeit: "<"
    }
});


app.controller("EintragController", function ($log) {

    $log.debug("EintragController()");

});
