import { isObject } from 'lodash';
import {PolyConfig} from '../src/index';

let config = new PolyConfig()
    .from('env', 1, {prefix: 'MYAPP'})
    .from('yaml', 2, {path: __dirname + '/config.yaml'})
    .from('json', 3, {path: __dirname + '/config.json'})
    .require('server.port', Number)
    .optional('server.headers', () => isObject, {})
    .require('cooldownDuration', Number)

console.log(config.get());

