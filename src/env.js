(function (window) {
    window.__env = window.__env || {};

    // DEV URLs
    // window.__env.API_URL = 'https://dev-dcore.mobifi.vn/api/v1';
    // window.__env.SOCKET_URL = 'https://dev-csocket.mobifi.vn';
    // window.__env.SOCKET_CHAT = '/websocket-dob';
    // window.__env.API_GET_IMG = 'https://dev-dcore.mobifi.vn/api/v1/file/public/image/';
    // window.__env.API_UPLOAD_QR = 'https://qr.mobifi.vn/upload';
    // window.__env.tokenAPIUploadQR = 'MvLFde3lnJELRRU';
    // window.__env.currentDomain = 'https://dev-paso.mobifi.vn';
    // window.__env.rewardDomain = 'https://dev-reward.mobifi.vn/uudai';
    // window.__env.landingPageDomain = 'https://dev-landingpage.mobifi.vn';
    // window.__env.RECAPTCHA_V3_SITE_KEY = '6Ldv6EspAAAAAP-puthv54lZXgOBwIPdcx8nF4Vv';
    // window.__env.encryptAESKey = 'secret_key_dob_1';

    // QA URLs
    // window.__env.API_URL = 'https://qa-dcore.mobifi.vn/api/v1';
    // window.__env.SOCKET_URL = 'https://qa-dobsocket.mobifi.vn';
    // window.__env.SOCKET_CHAT = '/websocket-dob';
    // window.__env.API_GET_IMG = 'https://qa-dcore.mobifi.vn/api/v1/file/public/image/';
    // window.__env.API_UPLOAD_QR = 'https://qr.mobifi.vn/upload';
    // window.__env.tokenAPIUploadQR = 'MvLFde3lnJELRRU';
    // window.__env.currentDomain = 'https://qa-paso.mobifi.vn';
    // window.__env.rewardDomain = 'https://qa-reward.mobifi.vn/uudai';
    // window.__env.landingPageDomain = 'https://qa-landingpage.mobifi.vn';
    // window.__env.RECAPTCHA_V3_SITE_KEY = '6Ldv6EspAAAAAP-puthv54lZXgOBwIPdcx8nF4Vv';
    // window.__env.encryptAESKey = 'secret_key_dob_1';

    // UAT URLs
    window.__env.API_URL = 'https://uat-dcore.mobifi.vn/api/v1';
    window.__env.SOCKET_URL = 'https://uat-dobsocket.taichinhdidong.vn';
    window.__env.SOCKET_CHAT = '/websocket-dob';
    window.__env.API_GET_IMG = 'https://uat-dcore.mobifi.vn/api/v1/file/public/image/';
    window.__env.API_UPLOAD_QR = 'https://uat-qr.mobifi.vn/upload';
    window.__env.tokenAPIUploadQR = 'MvLFde3lnJELRRU';
    window.__env.currentDomain = 'https://uat-paso.mobifi.vn';
    window.__env.rewardDomain = 'https://uat-reward.mobifi.vn/uudai';
    window.__env.landingPageDomain = 'https://uat-landingpage.mobifi.vn';
    window.__env.RECAPTCHA_V3_SITE_KEY = '6Ldv6EspAAAAAP-puthv54lZXgOBwIPdcx8nF4Vv';
    window.__env.encryptAESKey = 'secret_key_dob_1';

    // Variables
    window.__env.numberRetry = 5;
    window.__env.timeRetry = 15000;
    window.__env.botScoreBelowThreshold = 0.5;
    window.__env.cameraStartingMsToTimeout = 3000;
    window.__env.disableCaptcha = false;
    window.__env.bypassCaptchaScore = true;
    window.__env.enableDebug = true;
}(this));
