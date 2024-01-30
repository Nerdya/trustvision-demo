import { Component, OnInit } from '@angular/core';

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
      "liveness_modes": [
        "active",
        "passive"
      ],
      "scan_qr": "none",
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
        "index_collections": [
          {
            "id": "id_card",
            "label": "Mặt trước CMND/CCCD/Passport"
          },
          {
            "id": "portrait",
            "label": "Hình ảnh selfie của khách hàng"
          }
        ],
        "show_score": false
      }
    }
  }
}
export const logCredentials = { enable: false }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  TVInstance: TVWebSDKInstance | null = null;
  livenessMode = 'active';

  ngOnInit(): void {
    if (!window.TVWebSDK) return;
    this.TVInstance = new window.TVWebSDK.SDK({
      container: document.getElementById('container'),
      lang: 'vi',
      assetRoot: 'https://unpkg.com/@tsocial/tvweb-sdk@5.17.0/assets',
      enableAntiDebug: false,
    });

    if (!this.TVInstance) return;
    this.TVInstance.runPreloadEKYCResources();
  }

  onStartReadIDCard() {
    if (!this.TVInstance) return;
    const params = {
      clientSettings,
      logCredentials
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
