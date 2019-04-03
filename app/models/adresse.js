"use strict";

app.factory("Adresse", function () {

    function Adresse(strasse, hausnr, plz, ort) {
        this.strasse = strasse;
        this.hausnr = hausnr;
        this.plz = plz;
        this.ort = ort;

        this.lat = 0;
        this.lon = 0;
    }

    return Adresse;
});
