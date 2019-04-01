"use strict";

app.service("ApiService", function ($log) {

    $log.debug("ApiService()");

    const APP_ID = 'PrMutQw0GYIzmsPoWwSV';
    const APP_CODE = '_P73etTNPxern4N6HV69tA';

    this.getAppId = () => {
        return APP_ID;
    }

    this.getAppCode = () => {
        return APP_CODE;
    }

});
