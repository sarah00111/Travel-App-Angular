"use strict";

app.service("ApiService", function ($log) {

    $log.debug("ApiService()");

    /*const APP_ID = 'MowA86xvsS3fnhDi1Ino';
    const APP_CODE = 'g3kkINJvURUp47ss1zoLFQ';*/

    let index = 0;
    const APP_ID_ARRAY = [
        'MowA86xvsS3fnhDi1Ino',
        'pD7XVGLybCvWiNxfjZqC',
        'PrMutQw0GYIzmsPoWwSV',
        'rPYWQNQ1nvCpcnpxJ89a'

    ];
    const APP_CODE_ARRAY = [
        'g3kkINJvURUp47ss1zoLFQ',
        'Ig88nkteu746bX8mElp77A',
        '_P73etTNPxern4N6HV69tA',
        '5j6H-x0wKbbNOjKoHfLy-A'
    ];

    this.getIndex = () => {
        return index;
    }
    this.newCredentials = () => {
        if(index + 1 < APP_ID_ARRAY.length) {
            index++;
        }else {
            index = 0;
        }
    }

    this.getAppId = () => {
        return APP_ID_ARRAY[index];
    }

    this.getAppCode = () => {
        return APP_CODE_ARRAY[index];
    }

});
