import {EnvService} from './env.service';

export const EnvServiceFactory = () => {
    // Init EnvService
    const env = new EnvService();

    // Đọc các biến môi trường từ browser window
    const browserWindow = window || {};
    // @ts-ignore
    const browserWindowEnv = browserWindow['__env'] || {};

    // Gán các biến môi trường từ browser window vào env
    for (const key in browserWindowEnv) {
        if (browserWindowEnv.hasOwnProperty(key)) {
            // @ts-ignore
            env[key] = window['__env'][key];
        }
    }

    return env;
};

export const EnvServiceProvider = {
    provide: EnvService,
    useFactory: EnvServiceFactory,
    deps: [],
};
