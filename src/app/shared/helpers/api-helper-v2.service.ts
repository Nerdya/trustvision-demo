import {Injectable} from '@angular/core';
import {RestV2Connector} from "./rest-v2.connector";
import {Observable} from 'rxjs';
import {EnvService} from "../../services/env.service";

@Injectable({providedIn: 'root'})
export class ApiHelperV2Service {
    constructor(
        private restConnectorV2: RestV2Connector,
        private env: EnvService,
    ) {
    }

    getApiUrl() {
        return this.env.API_URL;
    }

    // GET
    getAll(path: string, params?: any, headers?: any, hasAuth?: boolean, config?: any): Observable<any> {
        const url = this.getApiUrl() + path;
        return this.restConnectorV2.get(url, params, headers, hasAuth, config);
    }

    getById(path: string, id: string = '', params?: any, headers?: any, hasAuth?: boolean, config?: any): Observable<any> {
        id !== '' && (path = path.toString().replace(':id', id));
        const url = this.getApiUrl() + path;
        return this.restConnectorV2.get(url, params, headers, hasAuth, config);
    }

    getByCode(path: string, code: string = '', params?: any, headers?: any, hasAuth?: boolean, config?: any): Observable<any> {
        code !== '' && (path = path.toString().replace(':code', code));
        const url = this.getApiUrl() + path;
        return this.restConnectorV2.get(url, params, headers, hasAuth, config);
    }

    getByUrl(url: string, params?: any, headers?: any, hasAuth?: boolean, config?: any): Observable<any> {
        return this.restConnectorV2.get(url, params, headers, hasAuth, config);
    }

    // POST
    create(path: string, body?: any, params?: any, headers?: any, hasAuth?: boolean, config?: any): Observable<any> {
        const url = this.getApiUrl() + path;
        return this.restConnectorV2.post(url, body, params, headers, hasAuth, config);
    }

    // PUT
    update(path: string, id: string = '', body?: any, params?: any, headers?: any, hasAuth?: boolean, config?: any): Observable<any> {
        id !== '' && (path = path.toString().replace(':id', id));
        const url = this.getApiUrl() + path;
        return this.restConnectorV2.put(url, body, params, headers, hasAuth, config);
    }

}
