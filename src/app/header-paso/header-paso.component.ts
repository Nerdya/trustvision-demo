import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-header-paso',
    templateUrl: './header-paso.component.html',
    styleUrls: ['./header-paso.component.scss']
})
export class HeaderPasoComponent implements OnInit {

    count = 0;
    routerLink = [
        '/enter-phone',
        '/verify-otp',
        '/current-address',
        '/notify-authn',
        '/nid-qr-scan-guide',
        '/nid-qr-scan',
        '/notify-loading',
        '/cccd-info',
        '/notify',
    ];

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit(): void {

    }

    test() {
        this.router.navigate([this.routerLink[this.count]]);
        ++this.count;
        if(this.count === this.routerLink.length) {
            this.count = 0;
        }
    }

    sendEmail() {
        const email = 'cskh@senid.vn';
        document.location = "mailto:"+email;
    }

    protected readonly console = console;
}
