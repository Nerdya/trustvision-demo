export const environment = {
    production: false,

    // OTP
    CUSTOMER_REGISTER: '/dob/contract/register',
    VERIFY_OTP: '/dob/verify/verify-otp',
    RESEND_OTP: '/dob/verify/resend-otp',
    CHECK_PHONE_NUMBER: '/dob/contract/check-phone',

    GEN_OTP: '/dob/verify/gen-otp',

    //paso
    CHECK_PHONE: '/dob/partner/check-phone-paso',
    NEXT_STEP: '/dob/next-step',
    NEW_NEXT_STEP: '/dob/next-step-new-flow',
    GET_FULL_STEP: '/config/full-step/:id',
    GET_NEW_FULL_STEP: '/dob/cog-screen/field-value',
    GET_LIST_AREA: '/dob/areas',
    GET_LIST_DISTRICT: '/dob/districts',
    GET_LIST_WARD: '/dob/wards',

    POST_QR_INFO: '/dob/qr-info',
    INIT_PROFILE: '/dob/contract/unknow-init',
    DROP_LIST_MULTIPLE: '/config/value-category/:id',
    GET_CONTRACT_BY_CODE: '/dob/contract/get/:code',
    GET_VEKYC_URL_BY_CODE: '/dob/contract/:code/vekyc/get',
    UPLOAD_DOCUMENT: '/dob/partner/upload-document',
    SUBMIT_OCR_INFO_FIRST_TIME: '/dob/contract/submit-ocr',
    SUBMIT_OCR_INFO: '/dob/contract/submit-info-paso',
    GET_FINAL_OFFER: '/dob/contract/:code/final_offer',
    INFO_VERIFY_PAIR: '/dob/contract/submit-info-verify-pair',
    GET_FATCA_INFOR: '/config/category/condition',
    GET_DOBFLOW_ID: '/config/dob-flow/allocation-flow',
    GET_LIST_INFO_OCR: '/dob/contract/get/ocr/:code',
    UPDATE_STATUS: '/dob/contract/change-status',
    GET_SEARCH_ADDRESS: '/dob/wards/get-search-address',
    VERIFY_CAPTCHA: '/dob/verify/captcha',
    UPDATE_COUNT_ERROR_VKYC: '/dob/verify/update-count-error-kyc',
    GET_META_ADDRESS: '/config/meta-address',
    UPLOAD_IMAGE: '/dob/verify/ts/upload-image',
    UPLOAD_FILE: '/dob/ts/upload-file',
    READ_NATIONAL_ID: '/dob/verify/ts/read-nationalId',
    VERIFY_PAIR: '/dob/verify/ts/verify-pair',
    UPLOAD_ATTACHMENT: '/dob/attachment/paso',
    INDEX_FACE: '/dob/ts/index-face',
    GET_TS_OCR: '/dob/contract/get/ts/ocr/:code',
};
