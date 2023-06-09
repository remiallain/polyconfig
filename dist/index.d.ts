export interface TPolyConfigVarSettings {
    type: (value: any) => any;
    required: boolean;
    default?: any;
}
export interface TPolyConfigVar {
    [key: string]: TPolyConfigVarSettings;
}
export interface TPolyConfigHandlerStore {
    [key: string]: (vars: TPolyConfigVar, settings: Record<string, any>) => Record<string, any>;
}
export interface TPolyConfigHandlerSettings {
    id: string;
    priority?: number;
    settings?: Record<string, any>;
}
export declare class PolyConfigError extends Error {
    constructor(message: string);
}
export declare class PolyConfig {
    private handlerStore;
    private handlers;
    private config;
    vars: TPolyConfigVar;
    requireOnLoad: boolean;
    requireOnAccess: boolean;
    constructor(vars?: TPolyConfigVar, handlers?: TPolyConfigHandlerSettings[]);
    from(handler: string, priority: number, settings: any): PolyConfig;
    require(key: string, type: (value: any) => any): PolyConfig;
    optional(key: string, type: (value: any) => any, defaultValue: any): PolyConfig;
    load(): PolyConfig;
    get(key?: string, defaultValue?: any): any;
}
