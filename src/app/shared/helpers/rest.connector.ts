'use strict';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core'
// @ts-ignore
import {delay, Observable, of, retryWhen, scan, take, tap, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {EnvService} from '../../services/env.service';
import {Router} from "@angular/router";
import {WaitingProcessComponent} from "../../waiting-process/waiting-process.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ExpireScreenComponent} from "../../expire-screen/expire-screen.component";

@Injectable({providedIn: 'root'})
export class RestConnector {
    httpOption: any = {};
    maxRetry = 1;
    showProcessScreen = true;
    waitingTimeout;
    private matBottomSheetRef;
    retrying = false;
    numberRetryApi = 0;

    constructor(
        private httpClient: HttpClient,
        private env: EnvService,
        private router: Router,
        private _bottomSheet: MatBottomSheet,
        private ngZone: NgZone
    ) {
        this.numberRetryApi = +this.env.numberRetry + 1;
    }

    getApiUrl() {
        return this.env.API_URL;
    }

    checkHttpCode(httpCode: any) {
        return;
    }

    private getHttpOption(params?: any, headers?: any, hasAuth = true) {
        const defaultHeaders = new HttpHeaders({
            'Accept': ['application/json;charset=utf-8'],
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
        });
        let httpOption = {
            headers: headers ?? defaultHeaders,
            params: new HttpParams(),
        };
        if (params) {
            const field: any = Object.keys(params);
            const valueField: any = Object.values(params);
            for (let i = 0; i < field.length; i++) {
                if (valueField[i] && valueField[i] !== null) {
                    httpOption.params = httpOption.params.append(field[i], valueField[i].toString());
                }
            }
        }
        if (hasAuth) {
            let token = sessionStorage.getItem('token');
            if (token) {
                httpOption.headers = httpOption.headers.set('token', token);
            } else {
                httpOption.headers = httpOption.headers.set('token', '');
            }
            const ip = sessionStorage.getItem('ip');
            httpOption.headers = httpOption.headers.set('ip', ip);
        }
        return httpOption;
    }

    showPopWaiting(msToTimeout = 5000) {
        if (msToTimeout <= 0) {
            return;
        }
        this.waitingTimeout = setTimeout(() => {
            const expireSession = sessionStorage.getItem('expireSession');
            if (this.showProcessScreen && !this.matBottomSheetRef && !expireSession) {
                // Use NgZone.run to update the view within Angular's zone
                this.ngZone.run(() => {
                    this.matBottomSheetRef = this._bottomSheet.open(WaitingProcessComponent, {disableClose: true});
                });
            }
        }, msToTimeout);
    }

    refreshWaitingParam() {
        this.showProcessScreen = false;
        clearTimeout(this.waitingTimeout);
        if (this.matBottomSheetRef) {
            this.matBottomSheetRef.dismiss();
            this.matBottomSheetRef = null;
        }
    }

    stopRetry() {
        if (--this.maxRetry < 1) {
            this.refreshWaitingParam();
            if (this.maxRetry == 0) {
                this.router.navigateByUrl('/error');
            }
            if (this.maxRetry < 0) {
                this.maxRetry = 1;
            }
        }
    }

    public get(path: string, params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<any> {
        if (!this.retrying) {
            let timeDelay = +this.env.timeRetry;
            this.maxRetry += this.env.numberRetry;
            const url: string = this.getApiUrl() + path;
            this.httpOption = this.getHttpOption(params, headers, hasAuth);
            if (path != 'https://httpbin.org/ip') {
                sessionStorage.setItem('currentApi', path);
            }
            try {
                this.showProcessScreen = true;
                this.showPopWaiting(msToShow);
                return this.httpClient.get<any>(url, this.httpOption).pipe(
                    map((resp: any) => {
                        if (!resp.status) {
                            this.checkHttpCode(resp.httpCode);
                        }
                        this.maxRetry -= this.env.numberRetry;
                        this.retrying = false;
                        this.refreshWaitingParam();
                        return resp;
                    }),
                    catchError((error) => throwError(() => {
                        if (error.status === 401) {
                            this.showProcessScreen = false;
                            this._bottomSheet.open(ExpireScreenComponent, {disableClose: true});
                            this.numberRetryApi = 0;
                            return of(null);
                        }
                        if ((error.status && error.status !== 401) || error.status === 0) {
                            this.handleApiError(error, path);
                            this.stopRetry();
                        } else {
                            timeDelay = 1;
                        }
                    })),
                    retryWhen(errors => errors.pipe(
                        scan(() => {
                            const currentApi = sessionStorage.getItem('currentApi');
                            if (currentApi !== path) {
                                throw errors;
                            }
                        }),
                        take(this.numberRetryApi),
                        delay(500),
                        tap((error) => {
                            if (error?.status) {
                                this.numberRetryApi != 0 && this.processBeforeRetry();
                            } else {
                                timeDelay = 1;
                            }
                        }),
                        delay(timeDelay),
                    )),
                );
            } catch (err: any) {
                throw new Error(err);
            }
        }
    }

    public getByUrl(url: string, params?: any, headers?: any, hasAuth = false, msToShow = 5000): Observable<HttpResponse<any>> {
        if (!this.retrying) {
            this.maxRetry += this.env.numberRetry;
            this.httpOption = this.getHttpOption(params, headers, hasAuth);
            if (url != 'https://httpbin.org/ip') {
                sessionStorage.setItem('currentApi', url);
            }
            try {
                this.showProcessScreen = true;
                this.showPopWaiting(msToShow);
                return this.httpClient.get<any>(url, this.httpOption).pipe(
                    map((resp: any) => {
                        if (!resp.status) {
                            this.checkHttpCode(resp.httpCode);
                        }
                        this.maxRetry -= this.env.numberRetry;
                        this.retrying = false;
                        this.refreshWaitingParam();
                        return resp;
                    }),
                    catchError((error) => throwError(() => {
                        if (error.status === 401) {
                            this.showProcessScreen = false;
                            this._bottomSheet.open(ExpireScreenComponent, {disableClose: true});
                            this.numberRetryApi = 0;
                            return of(null);
                        }
                        if ((error.status && error.status !== 401) || error.status === 0) {
                            this.handleApiError(error, url);
                            this.stopRetry();
                        }
                    })),
                    retryWhen(errors => errors.pipe(
                        scan(() => {
                            const currentApi = sessionStorage.getItem('currentApi');
                            if (currentApi !== url) {
                                throw errors;
                            }
                        }),
                        take(this.numberRetryApi),
                        delay(500),
                        tap(() => {
                            this.numberRetryApi != 0 && this.processBeforeRetry();
                        }),
                        delay(this.env.timeRetry)
                    ))
                );
            } catch (err: any) {
                throw new Error(err);
            }
        }
    }

    public post(path: string, body: any, params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<HttpResponse<any>> {
        if (!this.retrying) {
            let timeDelay = +this.env.timeRetry;
            this.maxRetry += this.env.numberRetry;
            const url: string = this.getApiUrl() + path;
            this.httpOption = this.getHttpOption(params, headers, hasAuth);
            sessionStorage.setItem('currentApi', path);
            try {
                this.showProcessScreen = true;
                this.showPopWaiting(msToShow);
                return this.httpClient.post<any>(url, body, this.httpOption).pipe(
                    map((resp: any) => {
                        if (!resp.status) {
                            this.checkHttpCode(resp.httpCode);
                        }
                        this.maxRetry -= this.env.numberRetry;
                        this.retrying = false;
                        this.refreshWaitingParam();
                        return resp;
                    }),
                    catchError((error) => {
                        if (error.status === 401) {
                            this.showProcessScreen = false;
                            this._bottomSheet.open(ExpireScreenComponent, {disableClose: true});
                            this.numberRetryApi = 0;
                            return of(null);
                        }
                        if ((error.status && error.status !== 401) || error.status === 0) {
                            this.handleApiError(error, path);
                            this.stopRetry();
                        } else {
                            timeDelay = 1;
                        }
                    }),
                    retryWhen(errors => errors.pipe(
                        scan(() => {
                            const currentApi = sessionStorage.getItem('currentApi');
                            if (currentApi !== path) {
                                throw errors;
                            }
                        }),
                        take(this.numberRetryApi),
                        delay(500),
                        tap((error) => {
                            if (error?.status) {
                                this.numberRetryApi != 0 && this.processBeforeRetry();
                            }
                        }),
                        delay(timeDelay)
                    )),
                );
            } catch (err: any) {
                throw new Error(err);
            }
        }
    }

    public put(path: string, body: any, params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<HttpResponse<any>> {
        if (!this.retrying) {
            this.maxRetry += this.env.numberRetry;
            sessionStorage.setItem('currentApi', path);
            const url: string = this.getApiUrl() + path;
            this.httpOption = this.getHttpOption(params, headers, hasAuth);
            try {
                this.showProcessScreen = true;
                this.showPopWaiting(msToShow);
                return this.httpClient.put<any>(url, body, this.httpOption).pipe(
                    map((resp: any) => {
                        if (!resp.status) {
                            this.checkHttpCode(resp.httpCode);
                        }
                        this.maxRetry -= this.env.numberRetry;
                        this.retrying = false;
                        this.refreshWaitingParam();
                        return resp;
                    }),
                    catchError((error) => throwError(() => {
                        if (error.status === 401) {
                            this.showProcessScreen = false;
                            this._bottomSheet.open(ExpireScreenComponent, {disableClose: true});
                            this.numberRetryApi = 0;
                            return of(null);
                        }
                        if ((error.status && error.status !== 401) || error.status === 0) {
                            this.handleApiError(error, path);
                            this.stopRetry();
                        }
                    })),
                    retryWhen(errors => errors.pipe(
                        scan(() => {
                            const currentApi = sessionStorage.getItem('currentApi');
                            if (currentApi !== path) {
                                throw errors;
                            }
                        }),
                        take(this.numberRetryApi),
                        delay(500),
                        tap((error) => {
                            this.numberRetryApi != 0 && this.processBeforeRetry();
                        }),
                        delay(this.env.timeRetry)
                    )),
                );
            } catch (err: any) {
                throw new Error(err);
            }
        }
    }

    processBeforeRetry() {
        // if (this.maxRetry > 0) {
        //     this.showPopWaiting();
        //     this.showProcessScreen = true;
        //     this.retrying = true;
        // }
    }

    handleApiError(error, path) {
        const currentApi = sessionStorage.getItem('currentApi');
        if (path === currentApi || currentApi == 'https://httpbin.org/ip') {
            this.refreshWaitingParam();
            switch (error.status) {
                case 500:
                    sessionStorage.setItem('errorKey', '500');
                    break;
                case 404:
                    sessionStorage.setItem('errorKey', '404');
                    break;
                case 0:
                    window.location.reload();
                    break;
                default:
                    sessionStorage.setItem('errorKey', 'other');
                    break;
            }
            this.router.navigateByUrl('/error-system');
        }
    }

}
