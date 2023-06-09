"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyConfigHandlerYaml = exports.PolyConfigHandlerJson = void 0;
var __1 = require("..");
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
function PolyConfigHandlerFile(vars, settings, formatter) {
    if (settings === void 0) { settings = { path: '' }; }
    if (!settings.path) {
        throw new __1.PolyConfigError("path is required for file provider");
    }
    var fileRaw = '';
    var fileConfig = {};
    try {
        fileRaw = fs_1.default.readFileSync(settings.path, 'utf8').toString();
    }
    catch (e) {
        throw new __1.PolyConfigError("file not found ".concat(settings.path));
    }
    try {
        fileConfig = formatter(fileRaw);
    }
    catch (e) {
        throw new __1.PolyConfigError("error parsing file ".concat(settings.path));
    }
    for (var key in vars) {
        if (fileConfig[key]) {
            fileConfig[key] = vars[key].type(fileConfig[key]);
        }
    }
    return fileConfig;
}
;
function PolyConfigHandlerJson(vars, settings) {
    if (settings === void 0) { settings = { path: '' }; }
    return PolyConfigHandlerFile(vars, settings, function (data) { return JSON.parse(data); });
}
exports.PolyConfigHandlerJson = PolyConfigHandlerJson;
function PolyConfigHandlerYaml(vars, settings) {
    if (settings === void 0) { settings = { path: '' }; }
    return PolyConfigHandlerFile(vars, settings, function (data) { return js_yaml_1.default.load(data); });
}
exports.PolyConfigHandlerYaml = PolyConfigHandlerYaml;
