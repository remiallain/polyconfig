# PolyConfig

A polyglot configuration library for node.js

<img src="./assets/PolyConfig.png" width="128" alt="PolyConfig"> 

> Bored of writing the same configuration code over and over again? __PolyConfig__ is here to help! you can use it to load configuration from various sources and mix them together with a priority order.

## Deep dive

*.env*
```env
API_SERVER_PORT=8080
API_SERVER_HEADERS_X-POWERED-BY=Env-Mummy
```

*api.yaml*
```yaml
server:
  headers:
    x-powered-by: Yaml-Daddy
  ping_response: up
```

*index.js*
```js
const poly = PolyConfig()
    .from('yaml', 1, { path: './api.yaml' }) // load from yaml file with priority of 1 (highest)
    .from('env', 2, { prefix: 'API' }) // load from environment variables with priority of 2 (lower)
    .require('server.port', Number) // set your first required var, require will throw if not found
    .optional('server.headers.x-powered-by', String, 'Default-Granny') // you can set optional vars with default values
    .optional('server.ping_response', (value: any) => (['up', 'down'].includes(value) ? value : 'down')) // and you can also set custom validator function ;)
let fullConfig = poly.get(); // access the full config object
let serverPort = poly.get('server.port'); // or to a specific value
let serverConfig = poly.get('server'); // or to a sub-object

console.log(fullConfig);
// {
//     server: {
//         port: 8080,
//         headers: {
//             'x-powered-by': 'Yaml-Daddy'
//         },
//         ping_response: 'up'
//     }
// }
```
