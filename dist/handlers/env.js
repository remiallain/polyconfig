"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyConfigHandlerEnv = void 0;
var lodash_1 = __importDefault(require("lodash"));
var process_1 = __importDefault(require("process"));
function PolyConfigHandlerEnv(vars, settings) {
    if (settings === void 0) { settings = { prefix: '' }; }
    var prefix = '';
    var envConfig = {};
    if (settings.prefix) {
        prefix = settings.prefix + '_';
    }
    for (var key in vars) {
        var keyEnv = key.split('.').join('_');
        if (process_1.default.env[prefix + keyEnv]) {
            lodash_1.default.set(envConfig, key, vars[key].type(process_1.default.env[prefix + keyEnv]));
        }
        else if (process_1.default.env[prefix + keyEnv.toUpperCase()]) {
            lodash_1.default.set(envConfig, key, vars[key].type(process_1.default.env[prefix + keyEnv.toUpperCase()]));
        }
    }
    return envConfig;
}
exports.PolyConfigHandlerEnv = PolyConfigHandlerEnv;
;
