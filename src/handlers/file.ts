import { PolyConfigError, TPolyConfigVar } from "..";
import fs from 'fs';
import yaml from 'js-yaml';

function PolyConfigHandlerFile(vars: TPolyConfigVar, settings: { path?: string } = { path: '' }, formatter: (data: string) => any) {
    if (!settings.path) {
        throw new PolyConfigError(`path is required for file provider`);
    }
    let fileRaw = '';
    let fileConfig: any = {};
    try {
        fileRaw = fs.readFileSync(settings.path, 'utf8').toString();
    } catch (e) {
        throw new PolyConfigError(`file not found ${settings.path}`);
    }
    try {
        fileConfig = formatter(fileRaw);
    } catch (e) {
        throw new PolyConfigError(`error parsing file ${settings.path}`);
    }
    for (let key in vars) {
        if (fileConfig[key]) {
            fileConfig[key] = vars[key].type(fileConfig[key])
        }
    }
    return fileConfig;
};

export function PolyConfigHandlerJson(vars: TPolyConfigVar, settings: { path?: string } = { path: '' }) {
    return PolyConfigHandlerFile(vars, settings, (data) => JSON.parse(data));
}

export function PolyConfigHandlerYaml(vars: TPolyConfigVar, settings: { path?: string } = { path: '' }) {
    return PolyConfigHandlerFile(vars, settings, (data) => yaml.load(data));
}