import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {
    allowedCardTypes,
    CardSide,
    clientSettings,
    customTexts,
    customTheme,
    EkycErrorPrefix,
    logCredentials,
    outputEncryptionSettings,
    stepsBackSide,
    stepsFrontSide,
    stepsQRCode,
    title,
    TVFailedVerdict,
    TVPassedVerdict,
    TVWebSDKInstance
} from "../shared/models/tvweb-sdk.model";
import {Router} from "@angular/router";
import {firstValueFrom, Subject} from "rxjs";
import {ExitPopupComponent} from "../exit-popup/exit-popup.component";
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {HttpHeaders} from "@angular/common/http";
import {ApiService} from "../services/api.service";
import * as moment from "moment/moment";
import {EkycLoadingComponent} from "../ekyc-loading/ekyc-loading.component";
import {CameraStartingComponent} from "../camera-starting/camera-starting.component";

@Component({
    selector: 'app-nid-auth',
    templateUrl: './nid-auth.component.html',
    styleUrls: ['./nid-auth.component.scss']
})
export class NidAuthComponent implements OnInit, OnDestroy {
    info: any = {
        type: 'CCCD/CMND',
        titleMain: 'Định danh điện tử',
        titleAbove: 'Bạn cần chuẩn bị CCCD gắn chíp để định danh điện tử theo quy định của Ngân hàng.  Thông tin bạn cung cấp được bảo mật mức độ tối đa.',
        titleAdd: 'Lưu ý trước khi chụp ảnh',
        list: [
            {
                linkImg: '../assets/paso/cccd1.svg',
                content: 'Giữ cố định CCCD gắn chip nằm thẳng trong khung hình',
            },
            {
                linkImg: '../assets/paso/cccd2.svg',
                content: 'Đảm bảo hình chụp giấy tờ không bị chói sáng, nhòe và mờ',
            },
            {
                linkImg: '../assets/paso/cccd3.svg',
                content: 'Sử dụng CCCD gắn chip chính chủ, không dùng giấy tờ mất góc, bản sao',
            }
        ],
        button: 'Bắt đầu',
    };
    limitCallApi = 0;
    startCapturingTime: number;
    completeCapturingTime: number;
    hideManualInput = sessionStorage.getItem('manual-input');
    isQRScannedInAPI = false;
    verdict: any;
    verdictType: EkycErrorPrefix;
    loadingBottomSheet: MatBottomSheetRef;

    dataOCRTS: any = {};
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

    private unsubscriber: Subject<void> = new Subject<void>();
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
        private _bottomSheet: MatBottomSheet,
        private bottomSheet: MatBottomSheet,
        private router: Router,
        private apiService: ApiService,
    ) {
    }

    ngOnInit(): void {
        history.pushState(null, '');
        if (this.isRejected() || this.hasReachedLimitCallApi()) {
            this.toError();
            return;
        }
        this.getListInfoOCRByCode();
        this.preloadEKYCResources();
        this.continueReadIDCard();
    }

    ngOnDestroy(): void {
        this.unsubscriber.next();
        this.unsubscriber.complete();
        // In case of error thrown
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

    getListInfoOCRByCode() {
        const contractCode = sessionStorage.getItem('contractCode');
        if (!contractCode) {
            return;
        }
        this.apiService.getTsOCRByCode(contractCode).subscribe((res: any) => {
            if (!res?.status) {
                return;
            }
            if (this.isUUID(res?.data?.imageId)) {
                sessionStorage.setItem('imageFront', res?.data?.imageId);
                sessionStorage.setItem('cardSide', CardSide.BACK);
            }
            if (res?.data?.ocrFrontValue) { // res should have both imageId and ocrFrontValue
                const ocrFrontValue = JSON.parse(res?.data?.ocrFrontValue);
                const infoOCRTS = ocrFrontValue?.result?.details[0];
                this.fillDataOCR(CardSide.FRONT, infoOCRTS);
            }
            this.listErrorCodeOCR = res?.data?.listErrorCodeOCR;
        });
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

    continueReadIDCard() {
        const cardSide = sessionStorage.getItem('cardSide');
        if (cardSide === CardSide.FRONT || cardSide === CardSide.QR_CODE) {
            this.onStartReadIDCard(CardSide.FRONT);
        }
        if (cardSide === CardSide.BACK) {
            this.onStartReadIDCard(CardSide.BACK);
        }
    }

    onStartReadIDCard(cardSide?: CardSide) {
        if (!cardSide) { // cardSide null means it's triggered the first time by user
            // This popup should only load the first time in one session
            const msToTimeout = 3000;
            msToTimeout > 0 && this.bottomSheet.open(CameraStartingComponent, {disableClose: true, data: {msToTimeout}});
            cardSide = CardSide.FRONT;
        }
        this.startCapturingTime = moment().utcOffset('+07:00').valueOf();
        sessionStorage.setItem('cardSide', cardSide);
        let steps: any;
        let handleStepDoneIDCard: any;
        if (cardSide === CardSide.FRONT) {
            // CuongNK: stepsFrontSide currently includes QR scan step (can toggle in clientSettings)
            steps = stepsFrontSide;
            handleStepDoneIDCard = this.handleStepDoneIDCardFront;
        } else if (cardSide === CardSide.QR_CODE) {
            // CuongNK: current business logic doesn't use this
            steps = stepsQRCode;
            handleStepDoneIDCard = this.handleStepDoneIDCardQRCode;
        } else if (cardSide === CardSide.BACK) {
            steps = stepsBackSide;
            handleStepDoneIDCard = this.handleStepDoneIDCardBack;
        }
        this.TVInstance?.readIDCardUIOnly({
            steps: steps,
            allowedCardTypes: allowedCardTypes,
            clientSettings: clientSettings,
            outputEncryptionSettings: outputEncryptionSettings,
            logCredentials: logCredentials,
            title: title,
            customTexts: customTexts,
            customTheme: customTheme,
            detectIdCard: this.handleDetectIdCard,
            onStepDone: handleStepDoneIDCard,
            onError: this.handleError,
            onClose: this.handleClose,
        });
    }

    // This callback is called from SDK to get card type to continue flow in some special cases.
    // Client should call this API https://ekyc.trustingsocial.com/api-reference/customer-api#detect-id-cards
    handleDetectIdCard = ({cardType, image, cardSide}) => {
        console.log('handleDetectIdCard', cardType, image, cardSide);
        return Promise.resolve({card_label: ''});
    }

    // Setup callback function to interact and receive results from Web SDK
    // This function will be called when a user finishes capture ID card
    handleStepDoneIDCardFront = async ({stepNumber, cardSide, cardType, image, qrScannedResult, recordedVideos, apiResult}) => {
        console.log('handleStepDoneIDCardFront', image?.blob);
        this.completeCapturingTime = moment().utcOffset('+07:00').valueOf();

        this.loadingBottomSheet = this.bottomSheet.open(EkycLoadingComponent, {disableClose: true});

        // Call upload api
        if (!image?.blob) {
            console.error('image?.blob is invalid');
            this.toError();
            return;
        }

        const frontIdPromise = this.uploadImageAsPromise(image?.blob,
            'cccd_front', 'id_card.vn.national_id.front');
        // If QR is detected when done taking front NID, save metadata
        let metadata = null;
        let qrIdPromise = Promise.resolve({data: {data: {imageId: null}}});
        console.log('qrScannedResult:', qrScannedResult);
        if (!qrScannedResult) {
            console.warn('SDK is unable to read QR from imageFront');
        } else {
            const {result: qrResult, image: qrImage} = qrScannedResult;
            qrResult && sessionStorage.setItem('dataQR', qrResult);
            metadata = `{\"raw\": \"${qrResult}\"}`;
            qrIdPromise = this.uploadImageAsPromise(qrImage?.blob,
                'qr_code', 'qr_code', 'QR', metadata);
        }
        const responses = await Promise.all([frontIdPromise, qrIdPromise]);
        const imageFront = responses[0]?.data?.data?.imageId ?? null;
        if (!this.isUUID(imageFront)) {
            console.error('upload-image imageFront failed');
            this.toError();
            return;
        }
        const imageQR = qrScannedResult ? responses[1]?.data?.data?.imageId : null;
        if (qrScannedResult && !this.isUUID(imageQR)) {
            console.error('upload-image imageQR failed');
            this.toError();
            return;
        }

        // Handle responses from upload api
        const type = 'CMT';
        const documentType = cardSide.toString().toUpperCase(); // FRONT / BACK
        imageFront && sessionStorage.setItem('imageFront', imageFront);
        imageQR && sessionStorage.setItem('imageQR', imageQR);

        // Call OCR api
        const status = await this.readNationalId(type, documentType, imageFront, metadata, imageQR);
        if (!status) {
            // CuongNK: current business logic doesn't use this
            // if (!this.isQRScannedInAPI) {
            //     console.warn('read-nationalId api is unable to read QR from imageFront');
            //     this.loadingBottomSheet?.dismiss();
            //     this.TVInstance?.destroyView();
            //     this.onStartReadIDCard(CardSide.QR_CODE);
            //     return;
            // }
            console.error('read-nationalId imageFront api failed');
            this.toError();
            return;
        }
        if (this.isRejected()) {
            console.warn('closeContract');
            this.toError();
            return;
        }
        if (!Object.values(TVPassedVerdict).includes(this.verdict)) {
            console.error('read-nationalId imageFront result failed');
            this.toError(this.verdict);
            return;
        }
        if (!this.checkValidate(documentType.toString().toLowerCase(), this.dataOCRTS)) {
            console.error('checkValidate failed');
            this.toError();
            return;
        }

        // Call upload attachment api
        const frontAttachmentPromise = this.uploadAttachmentAsPromise(image?.blob, 'cccd_front', 'OCR_FRONT', imageFront);
        const attachmentResult = await Promise.resolve(frontAttachmentPromise);
        if (!attachmentResult?.data) {
            console.error('attachment failed');
            this.toError();
            return;
        }

        this.loadingBottomSheet.dismiss();
        this.TVInstance?.destroyView();
        this.onStartReadIDCard(CardSide.BACK);
    }

    handleStepDoneIDCardQRCode = async ({stepNumber, cardSide, cardType, image, qrScannedResult, recordedVideos, apiResult}) => {
        console.log('handleStepDoneIDCardQRCode', qrScannedResult);
        this.completeCapturingTime = moment().utcOffset('+07:00').valueOf();

        this.loadingBottomSheet = this.bottomSheet.open(EkycLoadingComponent, {disableClose: true});

        console.log('qrScannedResult:', qrScannedResult);
        if (!qrScannedResult) {
            console.error('qrScannedResult is invalid');
            this.toError();
            return;
        }
        const {result: qrResult, image: qrImage} = qrScannedResult;
        qrResult && sessionStorage.setItem('dataQR', qrResult);
        const metadata = `{\"raw\": \"${qrResult}\"}`;
        const qrIdPromise = this.uploadImageAsPromise(qrImage?.blob,
            'qr_code', 'qr_code', 'QR', metadata);
        const response = await Promise.resolve(qrIdPromise);
        const imageQR = response?.data?.data?.imageId ?? null;
        if (!this.isUUID(imageQR)) {
            console.error('upload-image imageQR failed');
            this.toError();
            return;
        }

        // Handle responses from upload api
        const type = 'CMT';
        const documentType = 'QR';
        const imageFront = sessionStorage.getItem('imageFront') ?? null;
        imageQR && sessionStorage.setItem('imageQR', imageQR);

        // Call OCR api
        const status = await this.readNationalId(type, documentType, imageFront, null, imageQR);
        if (!status) {
            console.error('read-nationalId imageQR api failed');
            this.toError();
            return;
        }
        if (this.isRejected()) {
            console.warn('closeContract');
            this.toError();
            return;
        }
        if (!Object.values(TVPassedVerdict).includes(this.verdict)) {
            console.error('read-nationalId imageQR result failed');
            this.toError(this.verdict);
            return;
        }

        this.loadingBottomSheet?.dismiss();
        this.TVInstance?.destroyView();
        this.onStartReadIDCard(CardSide.BACK);
    }

    handleStepDoneIDCardBack = async ({stepNumber, cardSide, cardType, image, qrScannedResult, recordedVideos, apiResult}) => {
        console.log('handleStepDoneIDCardBack', image?.blob);
        this.completeCapturingTime = moment().utcOffset('+07:00').valueOf();

        this.loadingBottomSheet = this.bottomSheet.open(EkycLoadingComponent, {disableClose: true});

        // Call upload api
        if (!image?.blob) {
            console.error('image?.blob is invalid');
            this.toError();
            return;
        }
        const backIdPromise = this.uploadImageAsPromise(image?.blob,
            'cccd_back', 'id_card.vn.national_id.back');
        const response = await Promise.resolve(backIdPromise);
        const imageBack = response?.data?.data?.imageId;
        if (!this.isUUID(imageBack)) {
            console.error('upload-image imageBack failed');
            this.toError();
            return;
        }

        // Handle response from upload api
        const type = 'CMT';
        const documentType = cardSide.toString().toUpperCase(); // FRONT / BACK
        const imageFront = sessionStorage.getItem('imageFront');
        const imageQR = sessionStorage.getItem('imageQR');
        if (!this.isUUID(imageFront)) {
            console.error('imageFront is invalid');
            this.toError();
            return;
        }
        if (imageQR && !this.isUUID(imageQR)) {
            console.error('imageQR is invalid');
            this.toError();
            return;
        }

        // Call OCR api
        const status = await this.readNationalId(type, documentType, imageFront, null, imageQR, imageBack);
        if (!status) {
            console.error('read-nationalId imageBack api failed');
            this.toError();
            return;
        }
        if (this.isRejected()) {
            console.warn('closeContract');
            this.toError();
            return;
        }
        if (!Object.values(TVPassedVerdict).includes(this.verdict)) {
            console.error('read-nationalId imageBack result failed');
            this.toError(this.verdict);
            return;
        }
        if (!this.checkValidate(documentType.toString().toLowerCase(), this.dataOCRTS)) {
            console.error('checkValidate failed');
            this.toError();
            return;
        }

        // Call upload attachment api
        const backAttachmentPromise = this.uploadAttachmentAsPromise(image?.blob, 'cccd_back', 'OCR_BACK');
        const attachmentResult = await Promise.resolve(backAttachmentPromise);
        if (!attachmentResult?.status) {
            console.error('attachment failed');
            this.toError();
            return;
        }

        this.loadingBottomSheet?.dismiss();
        this.TVInstance?.destroyView();
        sessionStorage.removeItem('cardSide');
        this.submit();
    }

    handleError = (error: any) => {
        console.error('handleError', error);
        // error?.code should be one of TVDOMException's or TVErrorCode's values
        console.error('SDK failed');
        this.toError(error?.code);
    };

    handleClose = () => {
        this.TVInstance?.destroyView();
    }

    uploadImageAsPromise = async (blob: Blob, name: string, label: string, type = 'IMAGE', metadata?: string) => {
        const body = new FormData();
        const fileName = `${name}.${blob.type.substring(blob.type.indexOf('/') + 1)}`;
        const file = new File([blob], fileName, {type: blob.type});
        body.append('sessionId', sessionStorage.getItem('sessionId'));
        body.append('contractCode', sessionStorage.getItem('contractCode'));
        body.append('file', file);
        body.append('label', label);
        body.append('type', type);
        metadata && body.append('metadata', metadata);
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

    readNationalId = async (type, documentType, imageFront, metadata?, imageQR?, imageBack?) => {
        const body = new FormData();
        body.append('sessionId', sessionStorage.getItem('sessionId'));
        body.append('contractCode', sessionStorage.getItem('contractCode'));
        body.append('type', type);
        body.append('documentType', documentType);
        this.isUUID(imageFront) && body.append('imageFront', imageFront);
        body.append('startCapturingTime', this.startCapturingTime.toString());
        body.append('completeCapturingTime', this.completeCapturingTime.toString());
        metadata && body.append('metadata', metadata);
        this.isUUID(imageQR) && body.append('imageQR', imageQR);
        this.isUUID(imageBack) && body.append('imageBack', imageBack);
        const headers = new HttpHeaders({});
        const res = await firstValueFrom(this.apiService.readNationalId(body, {}, headers));
        const status = res?.status && res?.httpCode === 200;
        if (status) {
            this.handleEkycApiSuccess(res);
            this.fillDataOCR(documentType.toString().toLowerCase(), res?.data?.resultOcr?.data?.card_information);
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
            this.isQRScannedInAPI = true;
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
            // Check eKYC ID sanity
            this.verdict = res?.data?.checkSanityIDResponse?.data?.cardSanity?.verdict;
            if (res?.data?.checkSanityIDResponse && this.verdict !== TVPassedVerdict.GOOD) {
                this.verdictType = EkycErrorPrefix.ID_SANITY;
            }
            // Check eKYC ID tampering
            this.verdict = res?.data?.detectTamperingResponse?.data?.cardTampering?.verdict;
            if (res?.data?.detectTamperingResponse && this.verdict !== TVPassedVerdict.GOOD) {
                this.verdictType = EkycErrorPrefix.ID_TAMPERING;
            }
            // Check eKYC OCR
            this.verdict = res?.data?.resultOcr?.data?.card_information.find(item => item?.field === 'id')?.confidence_verdict;
            if (res?.data?.resultOcr && this.verdict !== TVPassedVerdict.SURE) {
                this.verdictType = EkycErrorPrefix.ID_OCR;
            }
        }
        switch (this.verdictType) {
            case EkycErrorPrefix.ID_SANITY:
                if (this.verdict === TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE) {
                    this.verdict = TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE_ID_SANITY;
                }
                break;
            case EkycErrorPrefix.ID_TAMPERING:
                if (this.verdict === TVFailedVerdict.ALERT) {
                    this.verdict = res?.data?.detectTamperingResponse?.data?.cardTampering?.details?.[0]?.verdict;
                }
                break;
            case EkycErrorPrefix.ID_OCR:
                if (this.verdict === TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE) {
                    this.verdict = TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE_OCR;
                }
                break;
        }
        this.handleFailedResult(this.verdict, count, closeContract);

        // CuongNK: current business logic doesn't use this
        // const raw = res?.data?.resultOcr?.image1?.qr?.raw;
        // if (!raw) {
        //     this.isQRScannedInAPI = false;
        //     return false;
        // }
    }

    handleEkycApiError = (res?: any) => {
        console.warn('handleEkycApiError: ', res);

        // handleRateLimited
        if (res?.errorCode?.slice(-4) === '0175') {
            this.limitCallApi = 5;
            sessionStorage.setItem('limitCallApi', this.limitCallApi.toString());
        }
    }

    handleFailedResult = (verdict: string, count: number, closeContract: boolean) => {
        console.log('handleFailedResult: verdict:', verdict, 'count:', count, 'closeContract:', closeContract);
        this.limitCallApi += 1;
        sessionStorage.setItem('limitCallApi', this.limitCallApi.toString());

        if (closeContract) {
            sessionStorage.setItem('isRejectCCCD', 'true');
        }
    }

    fillDataOCR(type: string, result: any){
        this.dataOCRTS = JSON.parse(sessionStorage.getItem('dataOCRTS')) ?? {};
        if (!result?.length) {
            return;
        }
        this.saveToDataOCRTS(type, result);
        const dataOCRTS = JSON.stringify(this.dataOCRTS);
        sessionStorage.setItem('dataOCRTS', dataOCRTS);
    }

    saveToDataOCRTS(type: string, result: any) {
        // let cardType = '';
        let id: any;
        let confidenceVerdict: any;
        let paperType: any;
        let residenceDetail = {
            province: null,
            district: null,
            ward: null,
            value: null
        };
        let residence = {
            addressDetail: null,
            provinceId: null,
            districtId: null,
            wardId: null
        };

        result.forEach(item => {
            switch (item.field) {
                // FRONT
                // case 'card_type':
                //     cardType = item?.value ?? '';
                //     break;
                case 'id':
                    id = item?.value ?? '';
                    confidenceVerdict = item?.confidence_verdict ?? '';
                    break;
                case 'id_1':
                    this.dataOCRTS.cccdOld = item?.value ?? '';
                    this.dataOCRTS.editCccdOld = 'TS_' + item?.confidence_verdict;
                    break;
                case 'name':
                    this.dataOCRTS.name = item?.value ?? '';
                    break;
                case 'dob':
                    this.dataOCRTS.birthday = this.convertDate(item?.value);
                    break;
                case 'gender':
                    this.dataOCRTS.gender = this.getGenderCodeByOCR(item?.value);
                    break;
                case 'address_level_1_(city)':
                    residenceDetail.province = item?.value ?? '';
                    break;
                case 'address_level_2_(district)':
                    residenceDetail.district = item?.value ?? '';
                    break;
                case 'address_level_3_(ward)':
                    residenceDetail.ward = item?.value ?? '';
                    break;
                case 'address_level_4':
                    residenceDetail.value = item?.value ?? '';
                    break;
                case 'address':
                    residence.addressDetail = item?.value ?? '';
                    break;
                case 'card_label':
                    paperType = item?.value ?? '';
                    break;
                // BACK
                case 'issue_date':
                    this.dataOCRTS.issueDate = this.convertDate(item?.value);
                    break;
                case 'issue_place':
                    this.dataOCRTS.issueBy = item?.value ?? '';
                    break;
                default:
                    break;
            }
        });
        if (type === CardSide.FRONT) {
            this.dataOCRTS.cccd = id;
            this.dataOCRTS.editCccd = 'TS_' + confidenceVerdict;
            this.dataOCRTS.residenceDetail = residenceDetail;
            this.dataOCRTS.address = residence;
            sessionStorage.setItem('paperTypeFront', paperType);
        } else {
            this.dataOCRTS.cccdBack = id;
            sessionStorage.setItem('paperTypeBack', paperType);
        }
    }

    checkValidate = (type: string, dataOCRTS: any) => {
        let valid = false;
        if (type === CardSide.FRONT) {
            const residenceDetail = dataOCRTS?.residenceDetail;
            if (dataOCRTS?.name && dataOCRTS?.birthday && dataOCRTS?.gender && dataOCRTS?.cccd && residenceDetail?.province && residenceDetail?.district && residenceDetail?.ward && residenceDetail?.value) {
                valid = true;
            }
        } else if (type === CardSide.BACK) {
            if (dataOCRTS?.issueDate && dataOCRTS?.issueBy) {
                valid = true;
            }
        }
        return valid;
    }

    getGenderCodeByOCR(ocrCode: any) {
        let genderCode = '';
        if (ocrCode?.toLowerCase() == 'nam') {
            genderCode = 'M';
        } else {
            genderCode = 'F';
        }
        return genderCode;
    }

    convertDate(date: any) {
        if (!date) {
            return;
        }
        if (!isNaN(date)) {
            return new Date(date);
        }
        let dateString = date;
        // let dateString = '16/01/1991';
        let dateParts;
        if (date.includes('/')) {
            dateParts = dateString?.split("/");
        }
        if (date.includes('-')) {
            dateParts = dateString?.split("-");
        }
        if (!dateParts || dateParts?.length < 3) {
            return;
        }
        // @ts-ignore
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
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
            code = TVFailedVerdict.NID_REJECT;
        } else if (this.hasReachedLimitCallApi()) {
            code = TVFailedVerdict.RATE_LIMIT;
        } else {
            code = TVFailedVerdict.NID_FAIL;
        }
        this.router.navigate(['/ekyc-error'], {queryParams: {path: 'nid-auth', code}});
    }
}
