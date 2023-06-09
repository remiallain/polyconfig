import { TPolyConfigVar } from "../index";

export function PolyConfigHandlerArg(vars: TPolyConfigVar, settings: { helper?: boolean} = {helper: true}) {
    const libArg = require('arg');
    let libArgConfig: any = {};
    let argConfig: any = {};
    for (let key in vars) {
        libArgConfig['--' + key.split('.').join('-')] = vars[key].type
    }
    if (settings.helper && !libArgConfig['--help']) {
        libArgConfig['--help'] = Boolean;
        libArgConfig['-h'] = Boolean;
    }
    let commandArguments = libArg(libArgConfig, { permissive: true });
    for (let key in vars) {
        let commandArgumentsKey = '--' + key.split('.').join('-');
        if (commandArguments[commandArgumentsKey]) {
            argConfig[key] = commandArguments[commandArgumentsKey]
        }
    }
    return argConfig;
};