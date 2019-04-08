"use strict";

app.factory("Route", function () {

    /*
    minuten: verfügbare Stunden für die Planung der route
    adressenArray: ein Array mit Adressen laut der adresse-Factory
    start: Objekt vom Typ Adresse, das angibt, wo die Route beginnt
    end: Objekt vom Typ Adresse, dass angibt, wo die Route endet
    waypoints: Array mit Einträgen vom Typ Adresse, dass alle Besichtigungspunkte enthält

    TODO: später evtl. ergänzen um tage (für verfügbare Tage falls das implementiert wird)
     */
    function Route(id, minuten) {
        this.id = id;
        this.minuten = minuten;
        this.start = "";
        this.end = "";
        this.waypoints = [];
    }

    /*newOrder... Array mit Einträgen vom Typ Adresse
    */
    this.changeWaypoints = (newOrder) => {
        $log.debug("METHODE WIRD AUFGERUFEN");
        this.waypoints = newOrder;
    }

    return Route;
});
