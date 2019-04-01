/**
 * Created by User on 25.03.2019.
 */

"use strict";

app.service("RespositoryService", function ($log, Route) {

    $log.debug("RespositoryService()");

    //Einträge sind Objekte vom Typ Adresse
    var rep = [];

    rep.push(new Route(0, 120));

    var id = 0;

    this.rep = () => {
        return rep;
    }

    this.getId = () => {
        id++;
        return id;
    }

    this.getRoute = (id) => {
        return rep[id];
    }

    //liefert der Route mit der id in dem rep-Array
    this.getRouteIndex = (id) => {
        let index;
        for(let i = 0; i < rep.length; i++) {
            if(rep[i].id = id) {
                index = i;
            }
        }
        return index;
    }

    this.newRoute = (id, zeitraum) => {
        rep.push(new Route(id, zeitraum));
    }

    //params ... Typ von Adresse
    this.newAddressForRoute = (id, params) => {
        let index = this.getRouteId(id);
        if(index) {
            rep[index].addAddress(params);
        }
    }

});

