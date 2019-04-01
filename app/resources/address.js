"use strict";

app.component("address", {
    templateUrl: "components/address.html",
    controller: "AddressController",
    bindings: {}
});

app.controller("AddressController", function ($log) {

    $log.debug("AddressController()");

});