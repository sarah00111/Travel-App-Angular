"use strict";

app.service("GetGeoDataService", function ($log, ApiService) {

    $log.debug("GetGeoDataService()");

    function getLatLon(strasse, hausnummer, ort) {
        $http
            .get('https://geocoder.api.here.com/6.2/geocode.json',
                {params: {app_id: ApiService.getAppId(), app_code: ApiService.getAppCode(),
                        street: strasse + " " + hausnummer, city: ort}})
            .then(response => {
                $log.debug("respone getLatLonService ", response);
            })
            .catch(error => {
                $log.error("Ooops, da ist wohl ein Fehler passiert...", error);
            });
    }

});
