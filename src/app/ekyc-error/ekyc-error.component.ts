import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TVFailedVerdict, TVDOMException, TVErrorCode} from "../shared/models/tvweb-sdk.model";
import {getDeviceInfo} from "../shared/models/common.model";

@Component({
    selector: 'app-ekyc-error',
    templateUrl: './ekyc-error.component.html',
    styleUrls: ['./ekyc-error.component.scss']
})
export class EkycErrorComponent implements OnInit {
    info = {
        linkImg: './assets/paso/error-icon.svg',
        titleMain: 'Có lỗi xảy ra!',
        titleAbove: 'Hệ thống gián đoạn, vui lòng thử lại sau.',
        note: '',
        button: 'Tải lại trang',
        routerLink: '/'
    }
    isRejectCCCD = sessionStorage.getItem('isRejectCCCD') === 'true';
    limitCallApi = Number(sessionStorage.getItem('limitCallApi')) || 1;
    errorCode = '';
    showInstruction = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (Object.keys(params).length === 0) {
                return;
            }
            switch (params?.['path']) {
                case 'nid-auth':
                    this.info.linkImg = './assets/paso/nid-fail.svg';
                    this.info.titleMain = 'Xác thực giấy tờ chưa thành công!';
                    this.info.note = 'Vui lòng đặt CCCD gắn chip vào khung hình của máy ảnh ở nơi đủ sáng, hình chụp đầy đủ, rõ nét, không có vật che/vết bẩn, không bị mờ/chói sáng.';
                    this.info.routerLink = '/nid-auth';
                    break;
                case 'face-auth':
                    this.info.linkImg = './assets/paso/face-fail.svg';
                    this.info.titleMain = 'Xác thực khuôn mặt chưa thành công!';
                    this.info.note = 'Vui lòng chụp ảnh chân dung rõ nét, nhìn thẳng vào camera, không đội mũ/ đeo kính râm/ khẩu trang.';
                    this.info.routerLink = '/face-auth';
                    break;
                default:
                    this.info.routerLink = '/enter-phone';
            }
            this.errorCode = params?.['code'];
            switch (this.errorCode) {
                // SDK error
                case TVDOMException.NOT_FOUND_ERR:
                case TVErrorCode.NOT_SUPPORTED:
                    this.info.titleMain = 'Camera không mở được';
                    this.info.titleAbove = 'Để tiếp tục vui lòng thực hiện các bước sau';
                    this.info.linkImg = './assets/paso/fail-camera-icon.svg';
                    this.info.button = '';
                    this.info.note = '';
                    this.showInstruction = true;
                    break;
                case TVErrorCode.UNABLE_TO_LOAD_MODEL:
                case TVErrorCode.NO_PERMISSION:
                    if (getDeviceInfo().osName === 'iOS') {
                        this.info.titleMain = 'Không truy xuất được camera';
                        this.info.titleAbove = 'Để tiếp tục đăng ký, vui lòng Tải lại trang, sau đó chọn Quét QR CCCD và “Cho phép (Allow)” truy cập camera bạn nhé!';
                        this.info.linkImg = './assets/paso/fail-camera-icon.svg';
                        this.info.button = 'Tải lại trang';
                    } else {
                        this.info.titleMain = 'Camera không mở được';
                        this.info.titleAbove = 'Để tiếp tục vui lòng thực hiện các bước sau';
                        this.info.linkImg = './assets/paso/fail-camera-icon.svg';
                        this.info.button = '';
                        // xài chung ui với trường hợp NOT_SUPPORTED camera
                        this.showInstruction = true;
                    }
                    this.info.note = '';
                    break;
                case TVErrorCode.NOT_READABLE:
                case TVErrorCode.CAMERA_TIMEOUT:
                    this.info.titleMain = 'Camera không mở được';
                    this.info.titleAbove = 'Camera đang được mở bởi trình duyệt hoặc ứng dụng khác (Zoom, Google Meet, Messenger,....).'
                    this.info.note = 'Vui lòng đóng các trình duyệt/ứng dụng đang mở camera hoặc thử lại trên trình duyệt/thiết bị khác để tiếp tục định danh điện tử.';
                    this.info.linkImg = './assets/paso/switch-camera-icon.svg';
                    this.info.button = 'Tải lại trang';
                    break;
                case TVDOMException.ABORT_ERR:
                case TVDOMException.INVALID_STATE_ERR:
                case TVDOMException.NOT_ALLOWED_ERR:
                case TVDOMException.NOT_READABLE_ERR:
                case TVDOMException.OVERCONSTRAINED_ERR:
                case TVDOMException.SECURITY_ERR:
                case TVDOMException.TYPE_ERR:
                    this.info.titleMain = 'Lỗi DOMException';
                    this.info.titleAbove = `${this.errorCode}`;
                    break;
                // Ekyc error
                case TVFailedVerdict.CUT:
                case TVFailedVerdict.INCOMPLETE:
                case TVFailedVerdict.NO_CARD_OR_INCOMPLETE_CARD:
                    this.info.titleAbove = 'Hình ảnh chụp bị thiếu góc.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.HOLE:
                case TVFailedVerdict.HOLE_AND_CUT:
                case TVFailedVerdict.PHOTO_TAMPERED:
                case TVFailedVerdict.INFO_TAMPERED:
                case TVFailedVerdict.AGE_NOT_MATCH:
                case TVFailedVerdict.ID_NOT_FOLLOW_RULE:
                case TVFailedVerdict.INVALID_EXPIRY_DATE:
                case TVFailedVerdict.CARD_EXPIRED:
                case TVFailedVerdict.INCORRECT_ISSUE_DATE:
                case TVFailedVerdict.INCORRECT_NATIVE_PLACE:
                case TVFailedVerdict.ABNORMAL_EMBLEM:
                case TVFailedVerdict.NO_EMBLEM:
                case TVFailedVerdict.EMBLEM_COVERED:
                case TVFailedVerdict.NOT_IN_SAME_CARD:
                case TVFailedVerdict.WRONG_FORMAT_IN_DOB:
                case TVFailedVerdict.WRONG_FONT_IN_RESIDENTIAL_PLACE:
                case TVFailedVerdict.WRONG_FONT:
                case TVFailedVerdict.ID_WITH_PRINTED_FONTS:
                case TVFailedVerdict.ID_WITH_TYPEWRITER_FONTS:
                case TVFailedVerdict.SIGNER_NAME_UNMATCHED:
                case TVFailedVerdict.SIGNER_NAME_UNMATCHED_OVERLAP:
                case TVFailedVerdict.WRONG_FORMAT_IN_RECOGNIZABLE_FEATURE_PHRASE:
                case TVFailedVerdict.QR_INFO_NOT_MATCH:
                case TVFailedVerdict.MRZ_NOT_FOLLOW_RULE:
                case TVFailedVerdict.IMAGE_HAS_HOLE:
                case TVFailedVerdict.IMAGE_HAS_CUT:
                case TVFailedVerdict.IMAGE_HAS_HOLE_AND_CUT:
                case TVFailedVerdict.COVERED:
                case TVFailedVerdict.ABNORMAL_OBJECT_EDGE:
                case TVFailedVerdict.ABNORMAL_OBJECT_INNER:
                case TVFailedVerdict.PHOTO_NOT_QUALIFIED:
                case TVFailedVerdict.NOT_QUALIFIED:
                case TVFailedVerdict.IMAGE_HAS_NO_FACES:
                case TVFailedVerdict.FACE_TOO_SMALL:
                case TVFailedVerdict.FACE_TOO_BIG:
                case TVFailedVerdict.IMAGE_HAS_NO_FACE:
                case TVFailedVerdict.UNMATCHED:
                case TVFailedVerdict.NID_FAIL:
                case TVFailedVerdict.FACE_FAIL:
                case TVFailedVerdict.UNSURE:
                    this.info.titleAbove = 'Hình ảnh chụp không hợp lệ.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.PHOTOCOPY:
                case TVFailedVerdict.PHOTOCOPIED:
                    this.info.titleAbove = 'Hình ảnh chụp là ảnh trắng đen.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.NON_LIVENESS:
                case TVFailedVerdict.IS_LIVE_FALSE:
                    this.info.titleAbove = 'Hình ảnh chụp từ màn hình thiết bị khác.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.IMAGE1_BLURRY:
                case TVFailedVerdict.IMAGE1_TOO_DARK:
                case TVFailedVerdict.IMAGE1_TOO_BRIGHT:
                case TVFailedVerdict.IMAGE1_GLARE_SAFE:
                case TVFailedVerdict.IMAGE1_GLARE_UNSAFE:
                case TVFailedVerdict.IMAGE2_BLURRY:
                case TVFailedVerdict.IMAGE2_TOO_BRIGHT:
                case TVFailedVerdict.IMAGE2_TOO_DARK:
                case TVFailedVerdict.IMAGE2_GLARE_SAFE:
                case TVFailedVerdict.IMAGE2_GLARE_UNSAFE:
                case TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE_ID_SANITY:
                case TVFailedVerdict.IMAGE_TOO_BLUR:
                case TVFailedVerdict.IMAGE_TOO_DARK:
                case TVFailedVerdict.IMAGE_TOO_BRIGHT:
                case TVFailedVerdict.FACE_TOO_DARK:
                case TVFailedVerdict.FACE_TOO_BRIGHT:
                    this.info.titleAbove = 'Hình ảnh chụp bị mờ/chói.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.INCORRECT_CARD_TYPE:
                case TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE_OCR:
                    this.info.titleAbove = 'Hệ thống không nhận diện được CCCD.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.IMAGE_HAS_MULTIPLE_FACES:
                    this.info.titleAbove = 'Hình ảnh chụp có nhiều khuôn mặt.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.RIGHT:
                case TVFailedVerdict.LEFT:
                    this.info.titleAbove = 'Hình chụp chân dung không nhìn thẳng.';
                    this.info.button = 'Chụp lại';
                    break;
                case TVFailedVerdict.OPEN_EYE_CLOSED_EYE:
                case TVFailedVerdict.CLOSED_EYE_OPEN_EYE:
                case TVFailedVerdict.CLOSED_EYE_CLOSED_EYE:
                    this.info.titleAbove = 'Hình chụp chân dung đang nhắm mắt.';
                    this.info.button = 'Chụp lại';
                    break;
                // Custom error
                case TVFailedVerdict.NID_REJECT:
                case TVFailedVerdict.FACE_REJECT:
                case TVFailedVerdict.RATE_LIMIT:
                    this.info.linkImg = './assets/paso/nid-reject.svg';
                    this.info.titleMain = 'SenID rất tiếc khi đăng ký mở thẻ chưa thành công';
                    this.info.titleAbove = 'Hiện tại chưa có sản phẩm thẻ phù hợp với bạn\nĐừng lo lắng vì bạn có thể thử lại sau 30 ngày';
                    this.info.note = '';
                    this.info.button = 'Quay về trang chủ';
                    break;
                default:
                    this.errorCode = null;
            }
        });
    }

    submit() {
        const currentStep = sessionStorage.getItem('currentStepId');
        switch (this.errorCode) {
            // SDK error
            case TVDOMException.NOT_FOUND_ERR:
            case TVErrorCode.NOT_SUPPORTED:
            case TVErrorCode.CAMERA_TIMEOUT:
            case TVErrorCode.UNABLE_TO_LOAD_MODEL:
            case TVErrorCode.NO_PERMISSION:
            case TVErrorCode.NOT_READABLE:
            case TVDOMException.ABORT_ERR:
            case TVDOMException.INVALID_STATE_ERR:
            case TVDOMException.NOT_ALLOWED_ERR:
            case TVDOMException.NOT_READABLE_ERR:
            case TVDOMException.OVERCONSTRAINED_ERR:
            case TVDOMException.SECURITY_ERR:
            case TVDOMException.TYPE_ERR:
                window.location.reload();
                break;
            // Ekyc error
            case TVFailedVerdict.CUT:
            case TVFailedVerdict.INCOMPLETE:
            case TVFailedVerdict.NO_CARD_OR_INCOMPLETE_CARD:
            case TVFailedVerdict.HOLE:
            case TVFailedVerdict.HOLE_AND_CUT:
            case TVFailedVerdict.PHOTO_TAMPERED:
            case TVFailedVerdict.INFO_TAMPERED:
            case TVFailedVerdict.AGE_NOT_MATCH:
            case TVFailedVerdict.ID_NOT_FOLLOW_RULE:
            case TVFailedVerdict.INVALID_EXPIRY_DATE:
            case TVFailedVerdict.CARD_EXPIRED:
            case TVFailedVerdict.INCORRECT_ISSUE_DATE:
            case TVFailedVerdict.INCORRECT_NATIVE_PLACE:
            case TVFailedVerdict.ABNORMAL_EMBLEM:
            case TVFailedVerdict.NO_EMBLEM:
            case TVFailedVerdict.EMBLEM_COVERED:
            case TVFailedVerdict.NOT_IN_SAME_CARD:
            case TVFailedVerdict.WRONG_FORMAT_IN_DOB:
            case TVFailedVerdict.WRONG_FONT_IN_RESIDENTIAL_PLACE:
            case TVFailedVerdict.WRONG_FONT:
            case TVFailedVerdict.ID_WITH_PRINTED_FONTS:
            case TVFailedVerdict.ID_WITH_TYPEWRITER_FONTS:
            case TVFailedVerdict.SIGNER_NAME_UNMATCHED:
            case TVFailedVerdict.SIGNER_NAME_UNMATCHED_OVERLAP:
            case TVFailedVerdict.WRONG_FORMAT_IN_RECOGNIZABLE_FEATURE_PHRASE:
            case TVFailedVerdict.QR_INFO_NOT_MATCH:
            case TVFailedVerdict.MRZ_NOT_FOLLOW_RULE:
            case TVFailedVerdict.IMAGE_HAS_HOLE:
            case TVFailedVerdict.IMAGE_HAS_CUT:
            case TVFailedVerdict.IMAGE_HAS_HOLE_AND_CUT:
            case TVFailedVerdict.COVERED:
            case TVFailedVerdict.ABNORMAL_OBJECT_EDGE:
            case TVFailedVerdict.ABNORMAL_OBJECT_INNER:
            case TVFailedVerdict.PHOTO_NOT_QUALIFIED:
            case TVFailedVerdict.NOT_QUALIFIED:
            case TVFailedVerdict.IMAGE_HAS_NO_FACES:
            case TVFailedVerdict.FACE_TOO_SMALL:
            case TVFailedVerdict.FACE_TOO_BIG:
            case TVFailedVerdict.IMAGE_HAS_NO_FACE:
            case TVFailedVerdict.UNMATCHED:
            case TVFailedVerdict.NID_FAIL:
            case TVFailedVerdict.FACE_FAIL:
            case TVFailedVerdict.UNSURE:
            case TVFailedVerdict.PHOTOCOPY:
            case TVFailedVerdict.PHOTOCOPIED:
            case TVFailedVerdict.NON_LIVENESS:
            case TVFailedVerdict.IS_LIVE_FALSE:
            case TVFailedVerdict.IMAGE1_BLURRY:
            case TVFailedVerdict.IMAGE1_TOO_DARK:
            case TVFailedVerdict.IMAGE1_TOO_BRIGHT:
            case TVFailedVerdict.IMAGE1_GLARE_SAFE:
            case TVFailedVerdict.IMAGE1_GLARE_UNSAFE:
            case TVFailedVerdict.IMAGE2_BLURRY:
            case TVFailedVerdict.IMAGE2_TOO_BRIGHT:
            case TVFailedVerdict.IMAGE2_TOO_DARK:
            case TVFailedVerdict.IMAGE2_GLARE_SAFE:
            case TVFailedVerdict.IMAGE2_GLARE_UNSAFE:
            case TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE_ID_SANITY:
            case TVFailedVerdict.IMAGE_TOO_BLUR:
            case TVFailedVerdict.IMAGE_TOO_DARK:
            case TVFailedVerdict.IMAGE_TOO_BRIGHT:
            case TVFailedVerdict.FACE_TOO_DARK:
            case TVFailedVerdict.FACE_TOO_BRIGHT:
            case TVFailedVerdict.INCORRECT_CARD_TYPE:
            case TVFailedVerdict.NOCARD_OR_MULTICARD_IMAGE_OCR:
            case TVFailedVerdict.IMAGE_HAS_MULTIPLE_FACES:
            case TVFailedVerdict.RIGHT:
            case TVFailedVerdict.LEFT:
            case TVFailedVerdict.OPEN_EYE_CLOSED_EYE:
            case TVFailedVerdict.CLOSED_EYE_OPEN_EYE:
            case TVFailedVerdict.CLOSED_EYE_CLOSED_EYE:
                this.router.navigate([this.info.routerLink]);
                break;
            case TVFailedVerdict.NID_REJECT:
            case TVFailedVerdict.FACE_REJECT:
            case TVFailedVerdict.RATE_LIMIT:
                this.router.navigate(['/']);
                break;
            default:
                console.warn(`errorCode ${this.errorCode} is not in any switch case`);
        }
    }

    copyToKeyBoard() {
        // let url = this.env.currentDomain;
        // const pathName = sessionStorage.getItem('pathName');
        // navigator.clipboard.writeText(`${url}${pathName}`);
    }
}
