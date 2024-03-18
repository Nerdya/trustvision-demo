import {Injectable} from '@angular/core';
import {RestConnector} from './rest.connector';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ApiHelperService {
    constructor(private restConnector: RestConnector) {
    }

    // GET
    getAll(path: string, params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<any> {
        return this.restConnector.get(path, params, headers, hasAuth, msToShow);
    }

    getById(path: string, id: string = '', params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this.restConnector.get(path, params, headers, hasAuth, msToShow);
    }

    getByCode(path: string, code: string = '', params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<any> {
        if (code !== '') {
            path = path.toString().replace(':code', code);
        }
        return this.restConnector.get(path, params, headers, hasAuth, msToShow);
    }

    getByUrl(url: string, params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<any> {
        return this.restConnector.getByUrl(url, params, headers, hasAuth, msToShow);
    }

    // POST
    create(path: string, body?: any, params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<any> {
        return this.restConnector.post(path, body, params, headers, hasAuth, msToShow);
    }

    // PUT
    update(path: string, id: string = '', body?: any, params?: any, headers?: any, hasAuth?: boolean, msToShow = 5000): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this.restConnector.put(path, body, params, headers, hasAuth, msToShow);
    }

}
