import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
    selector: 'app-camera-starting',
    templateUrl: './camera-starting.component.html',
    styleUrls: ['./camera-starting.component.scss'],
    standalone: true
})
export class CameraStartingComponent implements OnInit {
    msToTimeout: number;

    constructor(
        private bottomSheetRef: MatBottomSheetRef<CameraStartingComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    ) {
        this.msToTimeout = this.data?.msToTimeout;
    }

    ngOnInit() {
        if (this.msToTimeout <= 0) {
            return;
        }
        setTimeout(() => {
            this.bottomSheetRef.dismiss();
        }, this.msToTimeout);
    }
}

