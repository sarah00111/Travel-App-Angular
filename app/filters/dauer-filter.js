"use strict";

app.filter("dauerFilter", function ($filter) {

    //wert ist in Sekunden
    function dauerFilter(wert) {
        if(!(isNaN(wert))) {

            //funktioniert nur, wenn es weniger als 24h sind wegen dem Filter
            if(wert <= 86400) {
                return $filter('date')(wert * 1000, "shortTime", "UTC");
            }

            return getHours(wert/60, 0);
        }

        return;

    }

    function getHours(wert, stunden) {
        if(wert) {
            if(wert - 60 < 1) {
                return stunden + "h " + wert + " min";
            }

            wert = Math.floor(wert);
            return getHours(wert-60, stunden = stunden+1);
        }
        return;
    }

    return dauerFilter;
});
