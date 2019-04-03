"use strict";
//Route mehrere Punkte
app.component("rmp", {
    templateUrl: "components/rmp.html",
    controller: "RmpController",
    bindings: {}
});


app.controller("RmpController", function ($log, RespositoryService, $http) {

    $log.debug("RmpController()");

    this.adressen = RespositoryService.rep()[0].waypoints;
    this.start = RespositoryService.rep()[0].start;
    this.end = RespositoryService.rep()[0].end;

    this.$onInit = () => {
        $log.debug("start: ", this.start);

    }

});
