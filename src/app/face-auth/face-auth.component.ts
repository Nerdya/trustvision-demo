import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {
    apiCheck,
    apiCredentials,
    cameraScale,
    captureFrameSettings,
    clientSettings,
    customErrors,
    customTexts,
    customTheme,
    frontalMinSize,
    frontCamera,
    logCredentials,
    mode,
    offsetFaceY,
    outputEncryptionSettings,
    title,
    TVPassedVerdict,
    TVFailedVerdict,
    TVWebSDKInstance, EkycErrorPrefix
} from "../shared/models/tvweb-sdk.model";
import {Router} from "@angular/router";
// import {ShareService} from "../../service/share-service.service";
import {firstValueFrom, fromEvent, Subject, takeUntil} from "rxjs";
import {ExitPopupComponent} from "../exit-popup/exit-popup.component";
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {ApiService} from "../services/api.service";
import {HttpHeaders} from "@angular/common/http";
import * as moment from 'moment';
import {EkycLoadingComponent} from "../ekyc-loading/ekyc-loading.component";
import {CameraStartingComponent} from "../camera-starting/camera-starting.component";
@Component({
    selector: 'app-face-auth',
    templateUrl: './face-auth.component.html',
    styleUrls: ['./face-auth.component.scss']
})
export class FaceAuthComponent implements OnInit, OnDestroy {
    info: any = {
        titleMain: 'Xác thực khuôn mặt',
        titleAbove: 'Chụp ảnh khuôn mặt của bạn để xác thực hồ sơ theo quy định của Ngân hàng và đảm bảo an toàn thông tin',
        titleAdd: 'Lưu ý trước khi xác thực',
        list: [
            {
                linkImg: './assets/paso/faceId1.svg',
                content: 'Giữ khuôn mặt nằm trong khung ảnh',
            },
            {
                linkImg: './assets/paso/faceId2.svg',
                content: 'Không đeo kính râm, nón hoặc các phụ kiện che mặt',
            },
            {
                linkImg: './assets/paso/faceId3.svg',
                content: 'Đảm bảo môi trường chụp đủ sáng, không quá tối hoặc chói sáng',
            }
        ],
        button: 'Bắt đầu',
    };
    limitCallApi = 0;
    startSelfieTime: number;
    completeSelfieTime: number;
    verdict: any;
    verdictType: EkycErrorPrefix;
    loadingBottomSheet: MatBottomSheetRef;

    listErrorCodeOCR = [
        {code: '001', count: 0, maxLimit: 5},
        {code: '041', count: 0, maxLimit: 5},
        {code: '042', count: 0, maxLimit: 5},
        {code: '043', count: 0, maxLimit: 5},
        {code: '044', count: 0, maxLimit: 2},
        {code: '045', count: 0, maxLimit: 2},
        {code: '046', count: 0, maxLimit: 5},
        {code: '082', count: 0, maxLimit: 2},
        {code: 'incorrect_card_type', count: 0, maxLimit: 5},
        {code: 'wrong_side_nid', count: 0, maxLimit: 5},
        {code: 'not_in_same_card', count: 0, maxLimit: 2},
        {code: 'photo_not_qualified', count: 0, maxLimit: 5},
    ];

    // TrustVision Web SDK
    TVInstance: TVWebSDKInstance | null = null;
    batchFileIds = [];
    batchOrder = 0;

    unsubscriber: Subject<void> = new Subject<void>();
    @HostListener('window:popstate', ['$event'])
    onMessage() {
        let matBottomSheetRef = this._bottomSheet.open(ExitPopupComponent, {disableClose: true});
        matBottomSheetRef.afterDismissed().subscribe(value => {
            if (!value) {
                setTimeout(() => this.router.navigateByUrl('/home'));
            } else {
                history.pushState(null, '');
            }
        });
    }

    constructor(
      public apiService: ApiService,
      public _bottomSheet: MatBottomSheet,
      public bottomSheet: MatBottomSheet,
      public router: Router,
    ) {
    }

    ngOnInit(): void {
        window.scroll(0,0);
        history.pushState(null, '');
        if (this.isRejected() || this.hasReachedLimitCallApi()) {
            this.toError();
            return;
        }
        // this.getListInfoOCRByCode();
        this.preloadEKYCResources();
        this.continueDetectFace();
    }

    ngOnDestroy(): void {
        this.unsubscriber.next();
        this.unsubscriber.complete();
        // For avoiding calling upload-file multiple times
        this.loadingBottomSheet?.dismiss();
        this.TVInstance?.destroyView();
    }

    isUUID(str: string) {
        return RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).exec(str);
    }

    isRejected() {
        return sessionStorage.getItem('isRejectCCCD') === 'true';
    }

    hasReachedLimitCallApi() {
        // CuongNK: Not handled for now
        // this.limitCallApi = Number(sessionStorage.getItem('limitCallApi')) || 0;
        // return this.limitCallApi >= 5;
        return false;
    }

    preloadEKYCResources() {
        if (!window.TVWebSDK) return;
        this.TVInstance = new window.TVWebSDK.SDK({
            container: document.getElementById('tv-container'),
            lang: 'vi',
            // country: 'vn',
            assetRoot: 'https://unpkg.com/@tsocial/tvweb-sdk@5.17.0/assets',
            enableAntiDebug: false,
            // customUrls: {},
            // resourceRoot: 'https://vision-vnetwork-cdn.goevo.vn/',
            // warmupMessage: {
            //     en: 'Warming up... Please wait a moment',
            //     vi: 'Đang khởi động, vui lòng chờ trong giây lát...',
            // },
        });

        this.TVInstance?.runPreloadEKYCResources();
    }

    continueDetectFace() {
        const detectFaceAgain = sessionStorage.getItem('detectFaceAgain');
        detectFaceAgain === 'true' && this.onLivenessDetection(true);
    }

    onLivenessDetection(detectFaceAgain = false) {
        if (!detectFaceAgain) { // detectFaceAgain null means it's triggered the first time by user
            // This popup should only load the first time in one session
            const msToTimeout = 3000;
            msToTimeout > 0 && this.bottomSheet.open(CameraStartingComponent, {disableClose: true, data: {msToTimeout}});
        }
        this.startSelfieTime = moment().utcOffset('+07:00').valueOf();
        sessionStorage.setItem('detectFaceAgain', 'true');
        this.TVInstance?.livenessDetection({
            apiCheck: apiCheck,
            mode: mode,
            apiCredentials: apiCredentials,
            customErrors: customErrors,
            captureFrameSettings: captureFrameSettings,
            frontCamera: frontCamera,
            clientSettings: clientSettings,
            outputEncryptionSettings: outputEncryptionSettings,
            cameraScale: cameraScale,
            offsetFaceY: offsetFaceY,
            logCredentials: logCredentials,
            title: title,
            frontalMinSize: frontalMinSize,
            customTexts: customTexts,
            customTheme: customTheme,
            onLivenessDetectionDone: this.handleLivenessDetectionDone,
            onProcessing: this.handleProcessing,
            onReset: this.handleReset,
            onFramesCaptured: this.handleFramesCaptured,
            onError: this.handleError,
            onClose: this.handleClose,
        });
    }

    // Setup callback function to interact and receive results from Web SDK
    // This function will be called when a user finishes capture selfie
    handleLivenessDetectionDone = async ({
        steps, // gesture images
        frontalFaces, // list of frontal image
        frontalFacesEncrypted, // list of frontal image encrypted in base64 string, will be returned if outputEncryptionSettings.key is provided
        frontalScaledImage, // the scaled frontal image if frontalMinSize was specified
        capturedFrames, // sequence frames array record liveness process.
        video, // the raw video of liveness process, return if turn on via access key settings
        apiCheckPassed, // whether all liveness checks passed, appears only when apiCheck is enabled.
        verifyFaceLivenessResult, // appears only when apiCheck is enabled.
        verifyFacePortraitResult, // appears only when apiCheck is enabled.
    }) => {
        console.log('handleLivenessDetectionDone');
        this.completeSelfieTime = moment().utcOffset('+07:00').valueOf();

        this.loadingBottomSheet = this.bottomSheet.open(EkycLoadingComponent, {disableClose: true});

        // Host site will use these parameters to call API verify liveness check
        // Reference API https://ekyc.trustingsocial.com/api-reference/customer-api#1-request-5
        // frontalFaces: list frontal images mapping with API param 'images'
        console.log('frontal faces:', frontalFaces);
        const frontalPromises = [];
        if (!Array.isArray(frontalFaces)) {
            console.error('frontal faces array is invalid');
            this.toError();
            return;
        }
        for (const [index, frontalBlob] of frontalFaces.entries()) {
            frontalPromises.push(this.uploadImageAsPromise(frontalBlob, `frontal_face_${index}`, 'portrait'));
        }
        const lastFrontalBlob = frontalFaces[frontalFaces.length - 1];

        // steps: list gesture image mapping with API param 'gesture_images', each element contains params
        // name: mapping to 'gesture'
        // image: mapping to 'images'[0], always array with 1 element
        console.log('gestures faces:', steps);
        let leftPromise: any, rightPromise: any, upPromise: any;
        if (!Array.isArray(steps)) {
            console.error('steps array is invalid');
            this.toError();
            return;
        }
        for (const step of steps) {
            const gestureBlob: Blob = step?.image?.blob;
            const tempPromise = this.uploadImageAsPromise(gestureBlob, `gesture_face_${step.name}`, 'portrait');
            if (step.name === 'left') {
                leftPromise = tempPromise;
            } else if (step.name === 'right') {
                rightPromise = tempPromise;
            } else if (step.name === 'up') {
                upPromise = tempPromise;
            }
        }

        // capturedFrames: list frames mapping with API param 'videos'
        console.log('capturedFrames:', capturedFrames);

        console.log('batchFileIds: ', this.batchFileIds);

        const responses = await Promise.all([leftPromise, rightPromise, upPromise, ...frontalPromises]);
        if (!responses.every(res => res?.status)) {
            console.error('upload-image gesture and frontal failed');
            this.toError();
            return;
        }
        const frontalResults = responses.slice(3);

        // Handle responses from upload api
        const frontImage = sessionStorage.getItem('imageFront');
        const selfieImages = [];
        frontalResults.forEach((frontalResult) => {
            selfieImages.push(frontalResult?.data?.data?.imageId);
        });
        const gestureLeft = responses[0]?.data?.data?.imageId;
        const gestureRight = responses[1]?.data?.data?.imageId;
        const gestureUp = responses[2]?.data?.data?.imageId;
        const batchFileIds = this.batchFileIds;
        if (!this.isUUID(frontImage)) {
            console.error('frontImage is invalid');
            this.toError();
            return;
        }

        // Call verify pair api
        const status = await this.verifyPair(frontImage, gestureLeft, gestureRight, gestureUp, selfieImages, batchFileIds);
        if (!status) {
            console.error('verify-pair api failed');
            this.toError();
            return;
        }
        if (this.isRejected()) {
            console.warn('closeContract');
            this.toError();
            return;
        }
        if (!Object.values(TVPassedVerdict).includes(this.verdict)) {
            console.error('verify-pair result failed');
            this.toError(this.verdict);
            return;
        }

        // Call upload attachment api
        const lastSelfieImageId = selfieImages[selfieImages.length - 1];
        const selfieAttachmentPromise = this.uploadAttachmentAsPromise(lastFrontalBlob, 'selfie', 'PROFILE');
        const indexFacePromise = this.indexFaceAsPromise(lastSelfieImageId);
        const secondResults = await Promise.all([selfieAttachmentPromise, indexFacePromise]);
        if (!secondResults[0]?.status || !secondResults[1]?.status) {
            console.error('attachment failed');
            this.toError();
            return;
        }

        sessionStorage.removeItem('detectFaceAgain');
        this.loadingBottomSheet?.dismiss();
        this.TVInstance?.destroyView();
        this.submit();
    };

    handleProcessing = async () => {
        console.log('handleProcessing');
        // Show loading
        // return await new Promise<void>((resolve) => {
        //     setTimeout(() => {
        //         console.log('done!');
        //         resolve();
        //     }, 5000);
        // });
    };

    handleReset = () => {
        console.log('handleReset');
    };

    handleFramesCaptured = async (frames: any[]) => {
        console.log('handleFramesCaptured: frames:', frames);
        const response = await this.uploadFramesAsPromise(this.framesToTextFile(frames), 'onFramesCaptured', 'frame');
        if (!response?.status) {
            console.error('upload-file frames failed');
            this.toError();
            return;
        }
        console.log(`handleFramesCaptured: batchOrder`, this.batchOrder, `response:`, response);
        this.batchFileIds[this.batchOrder] = response?.data?.data?.fileId;
        this.batchOrder += 1;
    }

    handleError = (error: any) => {
        console.error('handleError', error);
        // error?.code should be one of TVDOMException's or TVErrorCode's values
        console.error('SDK failed');
        this.toError(error?.code);
    };

    handleClose = () => {
        this.TVInstance?.destroyView();
    };

    uploadImageAsPromise = async (blob: Blob, name: string, label: string, type = 'IMAGE', metadata?: string) => {
        const body = new FormData();
        const fileName = `${name}.${blob.type.substring(blob.type.indexOf('/') + 1)}`;
        const file = new File([blob], fileName, {type: blob.type});
        body.append('sessionId', sessionStorage.getItem('sessionId'));
        body.append('contractCode', sessionStorage.getItem('contractCode'));
        body.append('file', file);
        body.append('label', label);
        body.append('type', type);
        body.append('metadata', metadata);
        const headers = new HttpHeaders({});
        return await firstValueFrom(this.apiService.uploadImage(body, {}, headers));
    }

    uploadAttachmentAsPromise = async (blob: Blob, name: string, fileType: string, imageIdTS?: string) => {
        const body = new FormData();
        const fileName = `${name}.${blob.type.substring(blob.type.indexOf('/') + 1)}`;
        const file = new File([blob], fileName, {type: blob.type});
        body.append('contractCode', sessionStorage.getItem('contractCode'));
        body.append('file', file);
        body.append('fileType', fileType);
        body.append('type', 'CCCD_CHIP');
        imageIdTS && body.append('imageId', imageIdTS);
        const headers = new HttpHeaders({});
        return await firstValueFrom(this.apiService.uploadAttachment(body, {}, headers));
    }

    framesToTextFile(frames: any): Blob {
        const framesStr = JSON.stringify(frames);
        return new Blob([framesStr], {type: 'text/plain'});
    }

    uploadFramesAsPromise = async (blob: Blob, name: string, label: string) => {
        const body = new FormData();
        const fileName = `${name}.txt`;
        const file = new File([blob], fileName, {type: blob.type});
        body.append('sessionId', sessionStorage.getItem('sessionId'));
        body.append('contractCode', sessionStorage.getItem('contractCode'));
        body.append('file', file);
        body.append('label', label);
        body.append('type', 'FRAME');
        const headers = new HttpHeaders({});
        return await firstValueFrom(this.apiService.uploadFile(body, {}, headers));
    }

    indexFaceAsPromise = async (imageId: string) => {
        const body = new FormData();
        body.append('sessionId', sessionStorage.getItem('sessionId'));
        body.append('contractCode', sessionStorage.getItem('contractCode'));
        body.append('image', imageId);
        const headers = new HttpHeaders({});
        return await firstValueFrom(this.apiService.indexFace(body, {}, headers));
    }

    verifyPair = async (frontImage, gestureLeft, gestureRight, gestureUp, selfieImages, batchFileIds) => {
        const req = {
            sessionId: sessionStorage.getItem('sessionId'),
            contractCode: sessionStorage.getItem('contractCode'),
            frontImage,
            gestureLeft,
            gestureRight,
            gestureUp,
            selfieImages,
            batchFileIds,
            startSelfieTime: this.startSelfieTime,
            completeSelfieTime: this.completeSelfieTime,
        };
        const res = await firstValueFrom(this.apiService.verifyPair(req));
        const status = res?.status && res?.httpCode === 200;
        if (status) {
            this.handleEkycApiSuccess(res);
        } else {
            this.handleEkycApiError(res);
        }
        return status;
    }

    handleEkycApiSuccess = (res?: any) => {
        console.log('handleEkycApiSuccess:', res);
        const count = res?.data?.countOcr;
        const closeContract = res?.data?.closeContract;
        // Check reason from BE (null reason means success result)
        this.verdict = res?.data?.reason || TVPassedVerdict.GOOD;
        if (this.verdict === TVPassedVerdict.GOOD) {
            this.limitCallApi = 0;
            sessionStorage.removeItem('limitCallApi');
            sessionStorage.removeItem('isRejectCCCD');
            return;
        }
        // Handle failed result
        const hasPrefix = Object.values(EkycErrorPrefix).some(prefix => {
            if (this.verdict.includes(prefix)) {
                this.verdict = this.verdict.replace(prefix, '');
                this.verdictType = prefix;
                return true;
            }
            return false;
        });
        if (!hasPrefix) {
            // Check eKYC selfie sanity
            this.verdict = res?.data?.selfieSanityResponse?.data?.portraitSanity?.verdict;
            if (res?.data?.selfieSanityResponse && this.verdict !== TVPassedVerdict.GOOD) {
                this.verdictType = EkycErrorPrefix.SELFIE_SANITY;
            }
            // Check eKYC liveness
            this.verdict = res?.data?.faceLivenessResponse?.data?.live ? TVPassedVerdict.IS_LIVE_TRUE : TVFailedVerdict.IS_LIVE_FALSE;
            if (res?.data?.faceLivenessResponse && this.verdict !== TVPassedVerdict.IS_LIVE_TRUE) {
                this.verdictType = EkycErrorPrefix.LIVENESS;
            }
            // Check eKYC compare faces
            this.verdict = res?.data?.compareFacesResponse?.data?.compareFaces?.[0]?.result;
            if (res?.data?.compareFacesResponse && this.verdict !== TVPassedVerdict.MATCHED) {
                this.verdictType = EkycErrorPrefix.COMPARE_FACES;
            }
        }
        this.handleFailedResult(this.verdict, count, closeContract);
    }

    handleEkycApiError = (res?: any) => {
        console.warn('handleEkycApiError: ', res);

        // handleRateLimited
        if (res?.errorCode?.slice(-4) === '0175') {
            this.limitCallApi = 5;
            sessionStorage.setItem('limitCallApi', this.limitCallApi.toString());
        }
    }

    parseBEReasonToTVVerdict(verdict = '') {
        const prefixes = ['compare_faces_', 'liveness_', 'sanity_selfie', 'sanity_id_', 'tampering_id_', 'ocr_'];
        const verdictPrefix = prefixes.find(prefix => verdict.includes(prefix));
        verdictPrefix && (verdict = verdict.replace(verdictPrefix, ''));
        return verdict;
    }

    handleFailedResult = (verdict: string, count: number, closeContract: boolean) => {
        console.log('handleFailedResult: verdict:', verdict, 'count:', count, 'closeContract:', closeContract);
        this.limitCallApi += 1;
        sessionStorage.setItem('limitCallApi', this.limitCallApi.toString());

        if (closeContract) {
            sessionStorage.setItem('isRejectCCCD', 'true');
        }
    }

    submit() {
        this.router.navigate(['/home']);
    }

    toError(errorCode?: string) {
        this.loadingBottomSheet?.dismiss();
        this.TVInstance?.destroyView();
        let code: string;
        if (errorCode) {
            code = errorCode;
        } else if (this.isRejected()) {
            code = TVFailedVerdict.FACE_REJECT;
        } else if (this.hasReachedLimitCallApi()) {
            code = TVFailedVerdict.RATE_LIMIT;
        } else {
            code = TVFailedVerdict.FACE_FAIL;
        }
        this.router.navigate(['/ekyc-error'], {queryParams: {path: 'face-auth', code}});
    }
}
