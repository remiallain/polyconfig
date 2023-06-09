import _ from 'lodash';
import { PolyConfigHandlerArg } from './handlers/arg';
import { PolyConfigHandlerEnv } from './handlers/env';
import { PolyConfigHandlerJson, PolyConfigHandlerYaml } from './handlers/file';

export interface TPolyConfigVarSettings {
    type: (value: any) => any,
    required: boolean,
    default?: any
}
export interface TPolyConfigVar {
    [key: string]: TPolyConfigVarSettings
}

export interface TPolyConfigHandlerStore {
    [key: string]: (
        vars: TPolyConfigVar,
        settings: Record<string, any>
    ) => Record<string, any>;
}

export interface TPolyConfigHandlerSettings {
    id: string,
    priority?: number,
    settings?: Record<string, any>
}

export class PolyConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PolyConfigError";
    }
}

export class PolyConfig {
    private handlerStore: TPolyConfigHandlerStore = {};
    private handlers: TPolyConfigHandlerSettings[] = [];
    private config: any = {};
    public vars: TPolyConfigVar = {};
    public requireOnLoad: boolean = true;
    public requireOnAccess: boolean = false;

    constructor(vars: TPolyConfigVar = {}, handlers: TPolyConfigHandlerSettings[] = []) {
        this.handlerStore.arg = PolyConfigHandlerArg;
        this.handlerStore.env = PolyConfigHandlerEnv;
        this.handlerStore.yaml = PolyConfigHandlerYaml;
        this.handlerStore.json = PolyConfigHandlerJson;

        this.vars = vars;
        for (let handler of handlers) {
            this.from(handler.id, handler.priority ?? 0, handler.settings ?? {});
        }
    }

    public from(handler: string, priority: number, settings: any): PolyConfig {
        if (!this.handlerStore[handler]) {
            throw new PolyConfigError(`handler ${handler} not found`);
        }
        this.handlers.push({
            priority: priority,
            id: handler,
            settings: settings
        });
        return this;
    }

    public require(key: string, type: (value: any) => any): PolyConfig {
        this.vars[key] = {
            type: type,
            required: true
        }
        return this;
    }

    public optional(key: string, type: (value: any) => any, defaultValue: any): PolyConfig {
        this.vars[key] = {
            type: type,
            required: false,
            default: defaultValue
        }
        return this;
    }

    public load(): PolyConfig {
        let handlers: Record<string, any>[] = _.sortBy(this.handlers, ['priority']);
        let config: Record<string, any> = {};

        // load default values
        for (let key in this.vars) {
            if (this.vars[key].default) {
                _.set(config, key, this.vars[key].default)
            }
        }

        // load values from handlers
        for (let handler of handlers.sort((a, b) => b.priority - a.priority)) {
            let parser = this.handlerStore[handler.id];
            config = _.merge(config, parser(this.vars, handler.settings));
        }

        // require values
        if (this.requireOnLoad) {
            for (let key in this.vars) {
                if (this.vars[key].required && !_.get(config, key)) {
                    throw new PolyConfigError(`required config value ${key} not found`);
                }
            }
        }

        this.config = config;
        return this;
    }

    public get(key: string = '*', defaultValue: any = null): any {
        if (!this.config || Object.keys(this.config).length == 0) {
            this.load();
        }

        if (key === '' || key == '.' || key == '*') {
            return this.config;
        }

        if (this.requireOnAccess && !_.get(this.config, key)) {
            throw new PolyConfigError(`required config value ${key} not found`);
        }

        return _.get(this.config, key, defaultValue);
    }
}
