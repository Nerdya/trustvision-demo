'use strict';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core'
import {mergeMap, of, throwError, timer} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {EnvService} from "../../services/env.service";
import {ExpireScreenComponent} from "../../expire-screen/expire-screen.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class RestV2Connector {
    httpOption: any = {};
    defaultConfig = { // unused
        disableRetry: false,
        disableRetryDialog: false,
    };
    maxRetries = +this.env.numberRetry;
    retryInterval = +this.env.timeRetry;

    constructor(
        private httpClient: HttpClient,
        private env: EnvService,
        private router: Router,
        private bottomSheet: MatBottomSheet,
    ) {
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

    private resolveError(error: any, retryCount: number) {
        if (error.status === 401) {
            console.error('Authorization error.');
            this.bottomSheet.open(ExpireScreenComponent, {disableClose: true});
            return true;
        }
        if (retryCount >= this.maxRetries) {
            console.error('Max retries reached. Returning null.');
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
            this.router.navigate(['/error-system']);
            return true;
        }
        return false;
    }

    public get(url: string, params?: any, headers?: any, hasAuth?: boolean, config = this.defaultConfig, retryCount = 0) {
        this.httpOption = this.getHttpOption(params, headers, hasAuth);
        try {
            return this.httpClient.get<any>(url, this.httpOption).pipe(
                map((resp: any) => resp),
                catchError((error: any) => {
                    console.error('Error occurred:', error);
                    if (this.resolveError(error, retryCount)) {
                        return throwError(() => new Error(error));
                    }
                    console.warn(`Retrying in ${this.retryInterval}ms... Attempt ${retryCount + 1}`);
                    return timer(this.retryInterval).pipe(
                        mergeMap(() => this.get(url, params, headers, hasAuth, config, retryCount + 1))
                    );
                })
            );
        } catch (err: any) {
            throw new Error(err);
        }
    }

    public post(url: string, body: any, params?: any, headers?: any, hasAuth?: boolean, config = this.defaultConfig, retryCount = 0) {
        this.httpOption = this.getHttpOption(params, headers, hasAuth);
        try {
            return this.httpClient.post<any>(url, body, this.httpOption).pipe(
                map((resp: any) => resp),
                catchError((error: any) => {
                    console.error('Error occurred:', error);
                    if (this.resolveError(error, retryCount)) {
                        return throwError(() => new Error(error));
                    }
                    console.warn(`Retrying in ${this.retryInterval}ms... Attempt ${retryCount + 1}`);
                    return timer(this.retryInterval).pipe(
                        mergeMap(() => this.post(url, body, params, headers, hasAuth, config, retryCount + 1))
                    );
                })
            );
        } catch (err: any) {
            throw new Error(err);
        }
    }

    public put(url: string, body: any, params?: any, headers?: any, hasAuth?: boolean, config = this.defaultConfig, retryCount = 0) {
        this.httpOption = this.getHttpOption(params, headers, hasAuth);
        try {
            return this.httpClient.post<any>(url, body, this.httpOption).pipe(
                map((resp: any) => resp),
                catchError((error: any) => {
                    console.error('Error occurred:', error);
                    if (this.resolveError(error, retryCount)) {
                        return throwError(() => new Error(error));
                    }
                    console.warn(`Retrying in ${this.retryInterval}ms... Attempt ${retryCount + 1}`);
                    return timer(this.retryInterval).pipe(
                        mergeMap(() => this.put(url, body, params, headers, hasAuth, config, retryCount + 1))
                    );
                })
            );
        } catch (err: any) {
            throw new Error(err);
        }
    }

    public delete(url: string, params?: any, headers?: any, hasAuth?: boolean, config = this.defaultConfig, retryCount = 0) {
        this.httpOption = this.getHttpOption(params, headers, hasAuth);
        try {
            return this.httpClient.delete<any>(url, this.httpOption).pipe(
                map((resp: any) => resp),
                catchError((error: any) => {
                    console.error('Error occurred:', error);
                    if (this.resolveError(error, retryCount)) {
                        return throwError(() => new Error(error));
                    }
                    console.warn(`Retrying in ${this.retryInterval}ms... Attempt ${retryCount + 1}`);
                    return timer(this.retryInterval).pipe(
                        mergeMap(() => this.delete(url, params, headers, hasAuth, config, retryCount + 1))
                    );
                })
            );
        } catch (err: any) {
            throw new Error(err);
        }
    }
}
