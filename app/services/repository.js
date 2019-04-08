/**
 * Created by User on 25.03.2019.
 */

"use strict";


app.service("RespositoryService", function ($log, Route, Adresse) {

    $log.debug("RespositoryService()");

    //Einträge sind Objekte vom Typ Route
    var rep = [];

    //Dummy Eintrag zum Testen von RMP Komponente
    rep.push(new Route(0, 120));
    rep[0].start = new Adresse("Rennweg ", "89b", "1030", "Wien", 48.19072, 16.39729);
    rep[0].waypoints.push(new Adresse("Arsenalstraße", "1", "1030", "Wien", 48.18579, 16.38374));
    rep[0].waypoints.push(new Adresse("Bastiengasse", "38", "1180", "Wien", 48.2347, 16.31915));
    rep[0].waypoints.push(new Adresse("Lothringerstraße", "20", "1030", "Wien", 48.20077, 16.37719));
    rep[0].end = new Adresse("Rennweg", "89b", "1030", "Wien", 48.19072, 16.39729);

    var id = 0;

    this.rep = () => {
        return rep;
    }

    this.getId = () => {
        id++;
        return id;
    }

    /*
    id... id, die beim statparams mitgeliefert wird (=id-Attribut der Route)
     */
    this.getRoute = (id) => {
        let index = this.getRouteIndex(id);
        return rep[index];
    }

    /*id... id-Attribut der gesuchten Route
      Methode liefert den index in dem rep-Array der Route
    */
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

    //params ... Objekt vom Typ Adresse
    this.newAddressForRoute = (id, params) => {
        let index = this.getRouteIndex(id);
        if(index) {
            rep[index].waypoints.push(params);
        }
    }

});

