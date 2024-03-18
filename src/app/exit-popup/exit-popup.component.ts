import {Component, OnInit} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-exit',
    templateUrl: './exit-popup.component.html',
    styleUrls: ['./exit-popup.component.scss'],
    standalone: true
})
export class ExitPopupComponent implements OnInit {

    constructor(
        private _bottomSheetRef: MatBottomSheetRef<ExitPopupComponent>,
    ) {
    }

    ngOnInit() {
    }

    continue() {
        this._bottomSheetRef.dismiss(true);
    }
    goHome() {
        this._bottomSheetRef.dismiss(false);
    }

}

