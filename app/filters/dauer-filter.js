"use strict";

<<<<<<< HEAD
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
=======
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
>>>>>>> f567910820fd77934302f10eba96d01fca7d5d54
    }

    return dauerFilter;
});
