"use strict";
//Route mehrere Punkte
app.component("rmp", {
    templateUrl: "components/rmp.html",
    controller: "RmpController",
    bindings: {}
});


app.controller("RmpController", function ($log, RespositoryService) {

    $log.debug("RmpController()");

});
