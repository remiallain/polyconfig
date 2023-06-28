"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyConfig = exports.PolyConfigError = void 0;
var lodash_1 = __importDefault(require("lodash"));
var arg_1 = require("./handlers/arg");
var env_1 = require("./handlers/env");
var file_1 = require("./handlers/file");
var PolyConfigError = /** @class */ (function (_super) {
    __extends(PolyConfigError, _super);
    function PolyConfigError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "PolyConfigError";
        return _this;
    }
    return PolyConfigError;
}(Error));
exports.PolyConfigError = PolyConfigError;
var PolyConfig = /** @class */ (function () {
    function PolyConfig(vars, handlers) {
        if (vars === void 0) { vars = {}; }
        if (handlers === void 0) { handlers = []; }
        var _a, _b;
        this.handlerStore = {};
        this.handlers = [];
        this.config = {};
        this.vars = {};
        this.requireOnLoad = true;
        this.requireOnAccess = false;
        this.handlerStore.arg = arg_1.PolyConfigHandlerArg;
        this.handlerStore.env = env_1.PolyConfigHandlerEnv;
        this.handlerStore.yaml = file_1.PolyConfigHandlerYaml;
        this.handlerStore.json = file_1.PolyConfigHandlerJson;
        this.vars = vars;
        for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
            var handler = handlers_1[_i];
            this.from(handler.id, (_a = handler.priority) !== null && _a !== void 0 ? _a : 0, (_b = handler.settings) !== null && _b !== void 0 ? _b : {});
        }
    }
    PolyConfig.prototype.from = function (handler, priority, settings) {
        if (!this.handlerStore[handler]) {
            throw new PolyConfigError("handler ".concat(handler, " not found"));
        }
        this.handlers.push({
            priority: priority,
            id: handler,
            settings: settings
        });
        return this;
    };
    PolyConfig.prototype.require = function (key, type) {
        this.vars[key] = {
            type: type,
            required: true
        };
        return this;
    };
    PolyConfig.prototype.optional = function (key, type, defaultValue) {
        this.vars[key] = {
            type: type,
            required: false,
            default: defaultValue
        };
        return this;
    };
    PolyConfig.prototype.load = function () {
        var handlers = lodash_1.default.sortBy(this.handlers, ['priority']);
        var config = {};
        // load default values
        for (var key in this.vars) {
            if (this.vars[key].default) {
                lodash_1.default.set(config, key, this.vars[key].default);
            }
        }
        // load values from handlers
        for (var _i = 0, _a = handlers.sort(function (a, b) { return b.priority - a.priority; }); _i < _a.length; _i++) {
            var handler = _a[_i];
            var parser = this.handlerStore[handler.id];
            config = lodash_1.default.merge(config, parser(this.vars, handler.settings));
        }
        // require values
        if (this.requireOnLoad) {
            for (var key in this.vars) {
                if (this.vars[key].required && !lodash_1.default.get(config, key)) {
                    throw new PolyConfigError("required config value ".concat(key, " not found"));
                }
            }
        }
        this.config = config;
        return this;
    };
    PolyConfig.prototype.get = function (key, defaultValue) {
        if (key === void 0) { key = '*'; }
        if (defaultValue === void 0) { defaultValue = null; }
        if (!this.config || Object.keys(this.config).length == 0) {
            this.load();
        }
        if (key === '' || key == '.' || key == '*') {
            return this.config;
        }
        if (this.requireOnAccess && !lodash_1.default.get(this.config, key)) {
            throw new PolyConfigError("required config value ".concat(key, " not found"));
        }
        return lodash_1.default.get(this.config, key, defaultValue);
    };
    return PolyConfig;
}());
exports.PolyConfig = PolyConfig;
