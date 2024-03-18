import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EnvService} from "../services/env.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
    selector: 'expire-screen',
    templateUrl: './expire-screen.component.html',
    styleUrls: ['./expire-screen.component.scss'],
    standalone: true
})
export class ExpireScreenComponent implements OnInit {
    info = {
        linkImg: './assets/paso/expire-session-icon.svg',
        titleMain: 'Phiên làm việc hết hạn',
        titleAbove: 'Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục đăng ký.',
        button: 'Đăng nhập',
        routerLink: '',
    }

    constructor(
        private router: Router,
        public env: EnvService,
        public cdr: ChangeDetectorRef,
        private _bottomSheetRef: MatBottomSheetRef<ExpireScreenComponent>,
    ) {
    }

    ngOnInit(): void {}

    submit() {
        this._bottomSheetRef.dismiss();
        this.router.navigateByUrl('').then();
    }
}
