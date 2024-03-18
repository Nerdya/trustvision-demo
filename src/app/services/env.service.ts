import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EnvService {
    // URLs
    public API_URL = '';
    public SOCKET_URL = '';
    public SOCKET_CHAT = '';
    public API_GET_IMG = '';
    public API_UPLOAD_QR = '';
    public tokenAPIUploadQR = '';
    public currentDomain = '';
    public rewardDomain = '';
    public landingPageDomain = '';
    public RECAPTCHA_V3_SITE_KEY = '';
    public encryptAESKey = '';

    // Variables
    public numberRetry = 0;
    public timeRetry = 0;
    public botScoreBelowThreshold = 0;
    public cameraStartingMsToTimeout = 0;
    public disableCaptcha = false;
    public bypassCaptchaScore = false;
    public enableDebug = false;
}
