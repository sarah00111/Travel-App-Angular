"use strict";

app.factory("Adresse", function () {

    function Adresse(strasse, hausnr, plz, ort, lat, lon) {
        this.strasse = strasse;
        this.hausnr = hausnr;
        this.plz = plz;
        this.ort = ort;

        this.lat = lat;
        this.lon = lon;

    }

    return Adresse;
});
