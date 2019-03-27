/**
 * Created by User on 25.03.2019.
 */

"use strict";

app.service("RespositoryService", function ($log) {

    $log.debug("RespositoryService()");

    this.rep = [];

    function getRep() {
        return this.rep;
    }

    function newEintrag(param) {
        this.push(param);
    }

});

