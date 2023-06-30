import _ from "lodash";
import { TPolyConfigVar } from "..";
import process from 'process';

export function PolyConfigHandlerEnv(vars: TPolyConfigVar, settings: { prefix?: string } = { prefix: '' }) {
    let prefix: string = '';
    let envConfig: Record<string, any> = {};
    if (settings.prefix) {
        prefix = settings.prefix + '_';
    }
    for (let key in vars) {
        let keyEnv = key.split('.').join('_')
        if (process.env[prefix + keyEnv]) {
            _.set(envConfig, key, vars[key].type(process.env[prefix + keyEnv]))
        } else if (process.env[prefix + keyEnv.toUpperCase()]) {
            _.set(envConfig, key, vars[key].type(process.env[prefix + keyEnv.toUpperCase()]))
        }
    }
    return envConfig;
};