import { Component, OnInit } from '@angular/core';

export const steps = window.TVWebSDK.defaultReadIDCardSteps;
export const allowedCardTypes = [];
// export const clientSettings = window.TVWebSDK.defaultClientSettings;
export const clientSettings = {
  "data": {
    "country": "vn",
    "card_types": [
      {
        "code": "vn.national_id",
        "name": "CMND cũ / CMND mới / CCCD / Hộ chiếu",
        "orientation": "horizontal",
        "has_back_side": true,
        "front_qr": {
          "exist": true,
          "type": "qr_code",
        },
        "back_qr": {
          "exist": false
        }
      }
    ],
    "settings": {
      "scan_qr": "separate_step",
      "sdk_settings": {
        "id_detection_settings": {
          "auto_capture": {
            "enable": true,
            "show_capture_button": true,
            "wait_for_best_image_time_ms_web": 1000
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
            "threshold_web": 0.82
          },
          "disable_capture_button_if_alert": false,
          "exif_data_settings": {
            "enable": true
          },
          "id_detection": {
            "enable": true
          },
          "limit_time_settings": {
            "enable": true,
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
            "limit_time_second": 20
          },
          "virtual_cam_hashes": {
            "web": true,
            "mobile": false
          }
        }
      }
    },
  }
}
export const detectIdCard = () => Promise.resolve({card_label: ''});
export const onStepDone = async (onStepDoneResult: any) => {
  console.info('onStepDoneResult', onStepDoneResult);
};
export const onError = (error: any) => {
  console.error('onError', error);
};
export const outputEncryptionSettings = {key: ''};
export const logCredentials = {enable: false};
export const title = '';
export const customTexts = {};
export const onClose = () => {
  console.log('onClose');
};
export const customTheme = {
  closeButton: {
    display: 'none',
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  TVInstance: TVWebSDKInstance | null = null;
  livenessMode = 'active';

  ngOnInit(): void {
    this.preloadEKYCResources();
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
      // resourceRoot: null,
      // warmupMessage: {},
    });

    if (!this.TVInstance) return;
    this.TVInstance.runPreloadEKYCResources();
  }

  onStartReadIDCard() {
    if (!this.TVInstance) return;
    const params = {
      // steps,
      allowedCardTypes,
      clientSettings,
      detectIdCard,
      onStepDone,
      onError,
      outputEncryptionSettings,
      logCredentials,
      title,
      customTexts,
      // onClose,
      // customTheme,
    }
    this.TVInstance.readIDCardUIOnly(params);
  }

  onChangeLivenessMode(event: Event) {
    this.livenessMode = (event.target as HTMLSelectElement).value;
  }

  onLivenessDetection() {
    if (!this.TVInstance) return;
    this.TVInstance.livenessDetection({
      mode: this.livenessMode,
    });
  }
}
