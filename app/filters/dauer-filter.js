"use strict";

app.filter("dauerFilter", function () {

    function dauerFilter(wert) {
        //TODO: Wieso wert undefined?
        wert = wert / 60;
        wert = 6624 / 60;

        let test = getHours(wert, 0);

        return test;
    }

    function getHours(wert, stunden) {
        if(wert - 60 < 1) {
            return stunden + "h " + wert + " min";
        }

        wert = Math.floor(wert);
        return getHours(wert-60, stunden = stunden+1);
    }

    return dauerFilter;
});
