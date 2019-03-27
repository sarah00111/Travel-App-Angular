/**
 * Created by User on 25.03.2019.
 */

"use strict";

app.service("RespositoryService", function ($log) {

    $log.debug("RespositoryService()");

    let rep = [];

    this.getRep = () => {
        return rep;
    }

    this.newRoute = (param) => {
        rep.push(param);
    }

});

