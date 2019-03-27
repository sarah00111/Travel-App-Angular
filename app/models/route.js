"use strict";

app.factory("Route", function () {

    /*
    minuten: verfügbare Stunden für die Planung der route
    adressenArray: ein Array mit Adressen laut der adresse-Factory

    TODO: später evtl. ergänzen um tage (für verfügbare Tage falls das implementiert wird)
     */
    function Route(minuten, adressenArray) {
        this.minuten = minuten;
        this.adressenArray = adressenArray;
    }

    return Route;
});
