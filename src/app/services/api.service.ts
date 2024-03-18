import {Injectable} from '@angular/core';
import {ApiHelperService} from '../shared/helpers/api-helper.service';
import {ApiHelperV2Service} from "../shared/helpers/api-helper-v2.service";
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ApiService {
    constructor(
        private api: ApiHelperService,
        private apiV2: ApiHelperV2Service,
    ) {
    }

    verifyOTP(body?: any): Observable<any> {
        return this.api.create(environment.VERIFY_OTP, body);
    }

    resendOTP(params?: any): Observable<any> {
        return this.api.getAll(environment.RESEND_OTP, params);
    }

    nextStep(object: any): Observable<any> {
        const deactivateForever = sessionStorage.getItem('deactivateFlowPermanent');
        if (deactivateForever) {
            return this.api.create(environment.NEW_NEXT_STEP, object);
        }  else {
            return this.api.create(environment.NEXT_STEP, object);
        }
    }

    genOTP(obj?: any): Observable<any> {
        return this.api.getAll(environment.GEN_OTP, obj);
    }

    // PASO
    checkDuplicatePhone(body?: any): Observable<any> {
        return this.api.create(environment.CHECK_PHONE, body);
    }

    getFullStep(dobFlowId: any) {
        return this.api.getById(environment.GET_FULL_STEP, dobFlowId);
    }

    getValueField(data: any) {
        return this.api.getAll(environment.GET_NEW_FULL_STEP, data);
    }

    getListProvince(obj?: any): Observable<any> {
        return this.api.getAll(environment.GET_LIST_AREA, obj);
    }

    getListDistrict(obj?: any): Observable<any> {
        return this.api.getAll(environment.GET_LIST_DISTRICT, obj);
    }

    getListWard(obj?: any): Observable<any> {
        return this.api.getAll(environment.GET_LIST_WARD, obj);
    }

    postQRInfo(obj?: any): Observable<any> {
        return this.api.create(environment.POST_QR_INFO, obj);
    }

    getFinalOffer(obj?: any) {
        const contractCode = sessionStorage.getItem('contractCode');
        return this.api.getByCode(environment.GET_FINAL_OFFER, contractCode, obj);
    }

    getDropListMultiple(obj?: any): Observable<any> {
        const templateId = sessionStorage.getItem('templateId');
        return this.api.getById(environment.DROP_LIST_MULTIPLE, templateId, obj);
    }

    getContractByCode(code?: any): Observable<any> {
        return this.api.getByCode(environment.GET_CONTRACT_BY_CODE, code);
    }

    getVekycUrlByCode(code?: any): Observable<any> {
        return this.api.getByCode(environment.GET_VEKYC_URL_BY_CODE, code);
    }

    submitOcrInfo(body?: any): Observable<any> {
        return this.api.create(environment.SUBMIT_OCR_INFO, body);
    }

    getFatcaInfor(obj?: any) {
        return this.api.getAll(environment.GET_FATCA_INFOR, obj);
    }

    getIpAddress() {
        return this.api.getByUrl('https://httpbin.org/ip');
    }

    getDobFlowId(body?: any): Observable<any> {
        return this.api.create(environment.GET_DOBFLOW_ID, body);
    }

    getListInfoOCRByCode(): Observable<any> {
        const contractCode = sessionStorage.getItem('contractCode');
        return this.api.getByCode(environment.GET_LIST_INFO_OCR, contractCode);
    }

    updateStatus(obj: any): Observable<any> {
        return this.api.create(environment.UPDATE_STATUS, obj);
    }

    getSearchAddress(obj?: any): Observable<any> {
        return this.api.create(environment.GET_SEARCH_ADDRESS, obj);
    }

    updateCountErrorKyc(obj: any): Observable<any> {
        return this.api.create(environment.UPDATE_COUNT_ERROR_VKYC, obj);
    }

    getMetaAddress(params: any): Observable<any> {
        return this.api.getAll(environment.GET_META_ADDRESS, params);
    }

    uploadImage(body: any, params?: any, headers?: any, hasAuth?: boolean): Observable<any> {
        return this.apiV2.create(environment.UPLOAD_IMAGE, body, params, headers, hasAuth);
    }

    uploadFile(body: any, params?: any, headers?: any, hasAuth?: boolean): Observable<any> {
        return this.apiV2.create(environment.UPLOAD_FILE, body, params, headers, hasAuth);
    }

    readNationalId(body: any, params?: any, headers?: any, hasAuth?: boolean): Observable<any> {
        return this.apiV2.create(environment.READ_NATIONAL_ID, body, params, headers, hasAuth);
    }

    verifyPair(body: any, params?: any, headers?: any, hasAuth?: boolean): Observable<any> {
        return this.apiV2.create(environment.VERIFY_PAIR, body, params, headers, hasAuth);
    }

    uploadAttachment(body: any, params?: any, headers?: any, hasAuth?: boolean): Observable<any> {
        return this.apiV2.create(environment.UPLOAD_ATTACHMENT, body, params, headers, hasAuth);
    }

    indexFace(body: any, params?: any, headers?: any, hasAuth?: boolean): Observable<any> {
        return this.apiV2.create(environment.INDEX_FACE, body, params, headers, hasAuth);
    }

    getTsOCRByCode(contractCode: string): Observable<any> {
        return this.apiV2.getByCode(environment.GET_TS_OCR, contractCode);
    }
}
