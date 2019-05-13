"use strict";

// Einziges Modul dieser App und seine Abhängigkeiten
var app = angular.module("Vorlage", ["ngResource", "ngMessages", "ngLocale", "ngSanitize",
    "ngAnimate", "ngMaterial", "ui.router"]);


// Einstellungen für Debugging
app.config(function ($logProvider, $compileProvider, $mdAriaProvider, $qProvider) {
    $logProvider.debugEnabled(true);
    $compileProvider.debugInfoEnabled(true);
    $mdAriaProvider.disableWarnings();
    $qProvider.errorOnUnhandledRejections(false);
});


// Thema einstellen, mögliche Paletten sind:
// red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green,
// light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
app.config(function ($mdThemingProvider) {

    $mdThemingProvider.definePalette('palette', {
        '50': '176CBE',
        '100': 'E1E1E1',
        '200': '707070',
        '300': '0F4980',
        //gehören nicht zum theme
        '400': 'ef5350',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light

        'contrastDarkColors': ['300'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme("default")
        .primaryPalette("palette", {
            'default': '50',
            'hue-1': '100',
            'hue-2': '200',
            'hue-3': '300'
        });
});


// Datepicker auf AngularJS-Gebietsschema einstellen
app.config(function ($localeProvider, $mdDateLocaleProvider) {
    var locale = $localeProvider.$get();

    moment.locale(locale.id);

    $mdDateLocaleProvider.months = moment.months();
    $mdDateLocaleProvider.shortMonths = moment.monthsShort();
    $mdDateLocaleProvider.days = moment.weekdays();
    $mdDateLocaleProvider.shortDays = moment.weekdaysShort();
    $mdDateLocaleProvider.firstDayOfWeek = locale.DATETIME_FORMATS.FIRSTDAYOFWEEK;

    $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, "L", locale.id);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $mdDateLocaleProvider.formatDate = function (date) {
        var m = moment(date);
        return m.isValid() ? m.format("L") : "";
    };

    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
        return `${moment.monthsShort()[date.getMonth()]}  ${date.getFullYear()}`;
    };

    $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
        return `Woche ${weekNumber}`;
    };

    $mdDateLocaleProvider.msgCalendar = "Kalender";
    $mdDateLocaleProvider.msgOpenCalendar = "Kalender öffnen";
});
