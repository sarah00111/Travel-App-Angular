/**
 * Created by User on 25.03.2019.
 */

"use strict";

app.service("RespositoryService", function ($log) {

    $log.debug("RespositoryService()");

    var rep = [];

    var id = 0;

    this.getId = () => {
        id++;
        return id;
    }

    this.getRep = () => {
        return rep;
    }

    this.newRoute = (param) => {
        rep.push(param);
    }

    this.newAddressForRoute = (id, params) => {
        let index;
        for(let i = 0; i < rep.length; i++) {
            if(rep[i].id = id) {
                index = i;
            }
        }
        if(index) {
            rep[index].addAddress(params);
        }
    }

});

