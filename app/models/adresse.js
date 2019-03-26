"use strict";

app.factory("Adresse", function () {

    function Adresse(strasse, hausnr, plz, ort) {
        this.strasse = strasse;
        this.hausnr = hausnr;
        this.plz = plz;
        this.ort = ort;
    }

    return Adresse;
});
