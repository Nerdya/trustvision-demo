export interface TVWebSDKInstance {
    readIDCardUIOnly: (params: any) => void;
    livenessDetection: (params: any) => void;
    runPreloadEKYCResources: () => void;
    destroyView: () => void;
    // idCardContext: { qrSettings: { enableExif: false } };
}

export enum CardType {
    CMND_OLD = 'vn.cmnd_old',
    CMND = 'vn.cmnd',
    CCCD = 'vn.cccd',
    CCCD_NEW = 'vn.cccd_new',
}

export enum CardSide {
    FRONT = 'front',
    BACK = 'back',
    // This is not a card side, but whatever
    QR_CODE = 'qr_code',
}

export enum LivenessMode {
    ACTIVE = 'active',
    PASSIVE = 'passive',
    FLASH = 'flash',
}

// NID
export const stepsFrontSide = [
    {
        "scannerType": "id_card",
        "title": "Mặt trước CMND/CCCD",
        "description": "Vui lòng đặt CMND mặt trước vào trong khung",
        "titleIcon": "id_card_front.svg",
        "cardSide": "front",
        "cardType": "vn.national_id",
        "enableConfirmPopup": true
    },
];
export const stepsQRCode = [
    {
        "scannerType": "qr_code",
        "title": "Quét mã QR trên CCCD",
        "titleIcon": "",
        "enableConfirmPopup": false
    }
];
export const stepsBackSide = [
    {
        "scannerType": "id_card",
        "title": "Mặt sau CMND/CCCD",
        "description": "Vui lòng đặt CMND mặt sau vào trong khung",
        "titleIcon": "id_card_back.svg",
        "cardSide": "back",
        "cardType": "vn.national_id",
        "enableConfirmPopup": true
    }
];
export const allowedCardTypes = [CardType.CCCD_NEW];
export const clientSettings = {
    "data": {
        "card_types": [
            {
                "code": "vn.national_id",
                "name": "CMND cũ / CMND mới / CCCD / Hộ chiếu",
                "orientation": "horizontal",
                "has_back_side": true,
                "front_qr": {
                    "exist": false
                },
                "back_qr": {
                    "exist": false
                }
            }
        ],
        "country": "vn",
        "settings": {
            "enable_compare_faces": true,
            "enable_convert_pdf": true,
            "enable_detect_id_card_tampering": true,
            "enable_encryption": false,
            "enable_face_retrieval": true,
            "enable_index_faces": true,
            "enable_read_id_card_info": true,
            "enable_verify_face_liveness": true,
            "enable_verify_id_card_sanity": true,
            "enable_verify_portrait_sanity": true,
            "scan_qr": "none", // "none", "separate_step", "with_card",
            "liveness_modes": [
                "active",
                "passive"
            ],
            "sdk_settings": {
                "active_liveness_settings": {
                    "face_tracking_setting": {
                        "android_terminate_threshold": 0.002847,
                        "android_warning_threshold": 0.001474,
                        "enable": true,
                        "ios_terminate_threshold": 0.003393,
                        "ios_warning_threshold": 0.002176,
                        "limit_for": "all_flow",
                        "max_interval_ms": 2000,
                        "max_warning_time": 5,
                        "web_terminate_threshold": 0.0030152991993743408,
                        "web_warning_threshold": 0.0017317430600108828
                    },
                    "flow_interval_time_ms": 3000,
                    "limit_time_liveness_check": {
                        "enable": true,
                        "limit_time_second": 45
                    },
                    "record_video": {
                        "enable": false
                    },
                    "save_encoded_frames": {
                        "enable": true,
                        "frames_batch_len": 40,
                        "frames_interval_ms": 180,
                        "quality_android": 90,
                        "quality_ios": 80
                    },
                    "terminate_if_no_face": {
                        "enable": true,
                        "max_invalid_frame": 5,
                        "max_time_ms": 1000
                    }
                },
                "id_detection_settings": {
                    "auto_capture": {
                        "enable": true,
                        "show_capture_button": false,
                        "wait_for_best_image_time_ms": 2000,
                        "wait_for_best_image_time_ms_web": 2000
                    },
                    "card_type_check": {
                        "enable": true
                    },
                    "track_card_coordinates": {
                        "enable": false,
                        "max_length": 150
                    },
                    "blur_check": {
                        "enable": true,
                        "threshold_web": 0.29
                    },
                    "disable_capture_button_if_alert": true,
                    "exif_data_settings": {
                        "enable": true
                    },
                    "glare_check": {
                        "enable": true,
                        "threshold": 0.002
                    },
                    "id_detection": {
                        "enable": true
                    },
                    "limit_time_settings": {
                        "enable": false,
                        "limit_time_second": 30,
                        "video_partial_length_seconds": 15
                    },
                    "save_frame_settings": {
                        "enable": false,
                        "frames_interval_ms": 190,
                        "quality_web": 80
                    },
                    "scan_qr_settings": {
                        "enable": true,
                        "limit_time_second": 30
                    },
                    "virtual_cam_hashes": {
                        "web": true,
                        "mobile": false
                    }
                },
                "liveness_settings": {
                    "exif_data_settings": {
                        "enable": true
                    },
                    "take_one_picture_time_ms": 500
                },
                "server_log_settings": {
                    "enable": true
                }
            },
            "selfie_camera_options": [
                "front"
            ],
            "selfie_enable_detect_multiple_face": true,
            "support_transaction": false,
            "utilities": {
                "length_video_sec": 5,
                "num_of_photo_taken": 3,
                "photo_res": "640x640",
                "timing_take_photo_sec": "1,2.5,4"
            },
            "web_app_crop_face": "none",
            "web_ui": {
                "show_score": false
            }
        },
    }
}
export const outputEncryptionSettings = {key: ''};
export const logCredentials = {enable: false};
export const title = '';
export const customTexts = {};
export const customTheme = {closeButton: {display: 'none'}};

// FACE
export const apiCheck = false;
export const mode = LivenessMode.ACTIVE;
export const apiCredentials = {
    accessKey: '',
    secretKey: '',
    apiUrl: '',
};
export const customErrors = null;
export const captureFrameSettings = {
    enable: true,
    framesIntervalTime: 180,
    framesBatchLength: 15,
};
export const frontCamera = true;
export const cameraScale = 1.0;
export const offsetFaceY = 0;
export const frontalMinSize = null;

export enum TVErrorCode {
    NOT_SUPPORTED = 'not_supported',
    CAMERA_TIMEOUT = 'camera_timeout',
    WRONG_ORIENTATION = 'wrong_orientation',
    UNABLE_TO_LOAD_MODEL = 'unable_to_load_model',
    NO_PERMISSION = 'no_permission',
    NO_FACE = 'no_face',
    PARTIAL_FACE = 'partial_face',
    MULTIPLE_FACES = 'multiple_faces',
    FACE_TOO_SMALL = 'face_too_small',
    FACE_TOO_LARGE = 'face_too_large',
    FACE_OUT_OF_BOX = 'face_out_of_box',
    LIVENESS_TOO_FAST = 'liveness_too_fast',
    LIVENESS_TERMINATED = 'liveness_terminated',
    LIVENESS_TERMINATED_FACE_TRACKING = 'liveness_terminated_face_tracking',
    LIVENESS_TERMINATED_NO_FACE = 'liveness_terminated_no_face',
    LIVENESS_TERMINATED_TIME_OUT = 'liveness_terminated_time_out',
    CARD_SANITY_NOT_GOOD = 'card_sanity_not_good',
    API_CALL_ERROR = 'api_call_error',
    UPLOAD_ERROR = 'upload_error',
    SANITY_CHECK_ERROR = 'sanity_check_error',
    READ_ID_CARD_ERROR = 'read_id_card_error',
    DETECT_ID_TAMPERING_ERROR = 'detect_id_tampering_error',
    DETECT_ID_CARD_ERROR = 'detect_id_card_error',
    MISSING_FRONT_ID_CARD = 'missing_front_id_card',
    SERVER_ERROR = 'server_error',
    CLIENT_WEB_SETTING_NOT_FOUND = 'client_web_setting_not_found',
    ID_DETECTOR_VALIDATE_ANGLE_ERROR = 'id_detector_validate_angle_error',
    ID_DETECTOR_NO_CARDS = 'id_detector_no_cards',
    ID_DETECTOR_CARD_TOO_SMALL = 'id_detector_card_too_small',
    ID_DETECTOR_ERROR_INCOMPLETE = 'id_detector_error_incomplete',
    GLARE_DETECTED = 'glare_detected',
    ID_DETECTOR_ERROR_FRONT_SIDE_NO_FACES = 'id_detector_error_front_side_no_faces',
    ID_DETECTOR_ERROR_FRONT_SIDE_MULTIPLE_FACES = 'id_detector_error_front_side_multiple_faces',
    ID_DETECTOR_ERROR_BACK_SIDE_HAS_FACES = 'id_detector_error_back_side_has_faces',
    ID_DETECTOR_ERROR_BLUR = 'id_detector_error_blur',
    NOT_ALLOWED_CARD_TYPES = 'not_allowed_card_types',
    NOT_FRONTAL_FACE = 'not_frontal_face',
    NOT_READABLE = 'CameraInUseError',
    CLOSE_EYE = 'close_eye',
}

export enum TVDOMException {
    ABORT_ERR = 'AbortError',
    INVALID_STATE_ERR = 'InvalidStateError',
    NOT_ALLOWED_ERR = 'NotAllowedError',
    NOT_FOUND_ERR = 'NotFoundError',
    NOT_READABLE_ERR = 'NotReadableError',
    OVERCONSTRAINED_ERR = 'OverconstrainedError',
    SECURITY_ERR = 'SecurityError',
    TYPE_ERR = 'TypeError',
}

export enum TVPassedVerdict {
    GOOD = 'good',
    SURE = 'SURE',
    IS_LIVE_TRUE = 'is_live_true',
    MATCHED = 'matched',
}

export enum TVFailedVerdict {
    // ID tampering
    CUT = 'cut',
    HOLE = 'hole',
    HOLE_AND_CUT = 'hole_and_cut',
    PHOTOCOPY = 'photocopy',
    NON_LIVENESS = 'non-liveness',
    PHOTO_TAMPERED = 'photo_tampered',
    INFO_TAMPERED = 'info_tampered',
    AGE_NOT_MATCH = 'age_not_match',
    ID_NOT_FOLLOW_RULE = 'id_not_follow_rule',
    INVALID_EXPIRY_DATE = 'invalid_expiry_date',
    CARD_EXPIRED = 'card_expired',
    INCORRECT_ISSUE_DATE = 'incorrect_issue_date',
    INCORRECT_NATIVE_PLACE = 'incorrect_native_place',
    ABNORMAL_EMBLEM = 'abnormal_emblem',
    NO_EMBLEM = 'no_emblem',
    EMBLEM_COVERED = 'emblem_covered',
    NOT_IN_SAME_CARD = 'not_in_same_card',
    WRONG_FORMAT_IN_DOB = 'wrong_format_in_dob',
    WRONG_FONT_IN_RESIDENTIAL_PLACE = 'wrong_font_in_residential_place',
    WRONG_FONT = 'wrong_font',
    ID_WITH_PRINTED_FONTS = 'id_with_printed_fonts',
    ID_WITH_TYPEWRITER_FONTS = 'id_with_typewriter_fonts',
    SIGNER_NAME_UNMATCHED = 'signer_name_unmatched',
    SIGNER_NAME_UNMATCHED_OVERLAP = 'signer_name_unmatched_overlap',
    WRONG_FORMAT_IN_RECOGNIZABLE_FEATURE_PHRASE = 'wrong_format_in_recognizable_feature_phrase',
    QR_INFO_NOT_MATCH = 'qr_info_not_match',
    MRZ_NOT_FOLLOW_RULE = 'mrz_not_follow_rule',

    // ID sanity
    IMAGE_HAS_HOLE = 'image_has_hole',
    IMAGE_HAS_CUT = 'image_has_cut',
    IMAGE_HAS_HOLE_AND_CUT = 'image_has_hole_and_cut',
    IMAGE1_BLURRY = 'image1_blurry',
    IMAGE1_TOO_DARK = 'image1_too_dark',
    IMAGE1_TOO_BRIGHT = 'image1_too_bright',
    IMAGE1_GLARE_SAFE = 'image1_glare_safe',
    IMAGE1_GLARE_UNSAFE = 'image1_glare_unsafe',
    INCOMPLETE = 'incomplete',
    IMAGE2_BLURRY = 'image2_blurry',
    IMAGE2_TOO_DARK = 'image2_too_dark',
    IMAGE2_TOO_BRIGHT = 'image2_too_bright',
    IMAGE2_GLARE_SAFE = 'image2_glare_safe',
    IMAGE2_GLARE_UNSAFE = 'image2_glare_unsafe',
    NO_CARD_OR_INCOMPLETE_CARD = 'no_card_or_incomplete_card',
    NOCARD_OR_MULTICARD_IMAGE_ID_SANITY = 'nocard_or_multicard_image_id_sanity',
    PHOTOCOPIED = 'photocopied',
    COVERED = 'covered',
    ABNORMAL_OBJECT_EDGE = 'abnormal_object_edge',
    ABNORMAL_OBJECT_INNER = 'abnormal_object_inner',
    PHOTO_NOT_QUALIFIED = 'photo_not_qualified',

    // OCR
    INCORRECT_CARD_TYPE = 'incorrect_card_type',
    NOCARD_OR_MULTICARD_IMAGE_OCR = 'nocard_or_multicard_image_ocr',

    // Selfie sanity
    IMAGE_TOO_BLUR = 'image_too_blur',
    IMAGE_TOO_DARK = 'image_too_dark',
    IMAGE_TOO_BRIGHT = 'image_too_bright',
    FACE_TOO_DARK = 'face_too_dark',
    FACE_TOO_BRIGHT = 'face_too_bright',
    NOT_QUALIFIED = 'not_qualified',
    IMAGE_HAS_MULTIPLE_FACES = 'image_has_multiple_faces',
    IMAGE_HAS_NO_FACES = 'image_has_no_faces',
    FACE_TOO_SMALL = 'face_too_small',
    FACE_TOO_BIG = 'face_too_big',
    RIGHT = 'right',
    LEFT = 'left',
    OPEN_EYE_CLOSED_EYE = 'open_eye,closed_eye',
    CLOSED_EYE_OPEN_EYE = 'closed_eye,open_eye',
    CLOSED_EYE_CLOSED_EYE = 'closed_eye,closed_eye',

    // Selfie liveness detection
    IS_LIVE_FALSE = 'is_live_false',
    IMAGE_HAS_NO_FACE = 'image_has_no_face',

    // Face / ID matching
    UNMATCHED = 'unmatched',
    // IMAGE_HAS_NO_FACE = 'image_has_no_face',

    // Other verdict
    NOCARD_OR_MULTICARD_IMAGE = 'nocard_or_multicard_image',
    UNSURE = 'UNSURE',
    ALERT = 'alert',

    // Custom verdict
    NID_FAIL = 'nid-fail',
    FACE_FAIL = 'face-fail',
    NID_REJECT = 'nid-reject',
    FACE_REJECT = 'face-reject',
    RATE_LIMIT = 'rate-limit',
}

export enum EkycErrorPrefix {
    ID_SANITY = 'sanity_id_',
    ID_TAMPERING = 'tampering_id_',
    ID_OCR = 'ocr_',
    SELFIE_SANITY = 'sanity_selfie',
    LIVENESS = 'liveness_',
    COMPARE_FACES = 'compare_faces_',
}
