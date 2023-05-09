import { TPolyConfigVar } from "..";
import process from 'process';

export function PolyConfigHandlerEnv(vars: TPolyConfigVar, settings: { prefix?: string } = { prefix: '' }) {
    let prefix = '';
    let envConfig = {};
    if (settings.prefix) {
        prefix = settings.prefix.toUpperCase() + '_';
    }
    for (let key in vars) {
        let keyEnv = key.split('.').join('_').toUpperCase()
        if (process.env[prefix + keyEnv]) {
            envConfig[key] = vars[key].type(process.env[prefix + keyEnv])
        }
    }
    return envConfig;
};