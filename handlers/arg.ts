import { TPolyConfigVar } from "..";
import * as libArg from 'arg';

export function PolyConfigHandlerArg(vars: TPolyConfigVar, settings: { helper?: boolean} = {helper: true}) {
    let libArgConfig = {};
    let argConfig = {};
    for (let key in vars) {
        libArgConfig['--' + key.split('.').join('-')] = vars[key].type
    }
    if (settings.helper && !libArgConfig['--help']) {
        libArgConfig['--help'] = Boolean;
        libArgConfig['-h'] = Boolean;
    }
    let commandArguments = libArg(libArgConfig, options = { permissive: true });
    for (let key in vars) {
        let commandArgumentsKey = '--' + key.split('.').join('-');
        if (commandArguments[commandArgumentsKey]) {
            argConfig[key] = commandArguments[commandArgumentsKey]
        }
    }
    return argConfig;
};