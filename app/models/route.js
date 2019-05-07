"use strict";

app.factory("Route", function () {

    /*
    minuten: verfügbare Stunden für die Planung der route
    tage: verfügbare Tage (als Anzahl z.B. 4) für die Planung der route
    adressenArray: ein Array mit Adressen laut der adresse-Factory
    start: Objekt vom Typ Adresse, das angibt, wo die Route beginnt
    end: Objekt vom Typ Adresse, dass angibt, wo die Route endet
    waypoints: Array mit Einträgen vom Typ Adresse, dass alle Besichtigungspunkte enthält

     */
    function Route(id, minuten, tage) {
        this.id = id;
        this.minuten = minuten;
        this.tage = tage;
        this.start = "";
        this.end = "";
        this.waypoints = [];
    }

    return Route;
});
