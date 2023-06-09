"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyConfigHandlerArg = void 0;
function PolyConfigHandlerArg(vars, settings) {
    if (settings === void 0) { settings = { helper: true }; }
    var libArg = require('arg');
    var libArgConfig = {};
    var argConfig = {};
    for (var key in vars) {
        libArgConfig['--' + key.split('.').join('-')] = vars[key].type;
    }
    if (settings.helper && !libArgConfig['--help']) {
        libArgConfig['--help'] = Boolean;
        libArgConfig['-h'] = Boolean;
    }
    var commandArguments = libArg(libArgConfig, { permissive: true });
    for (var key in vars) {
        var commandArgumentsKey = '--' + key.split('.').join('-');
        if (commandArguments[commandArgumentsKey]) {
            argConfig[key] = commandArguments[commandArgumentsKey];
        }
    }
    return argConfig;
}
exports.PolyConfigHandlerArg = PolyConfigHandlerArg;
;
