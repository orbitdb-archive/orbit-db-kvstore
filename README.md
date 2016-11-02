# orbit-db-kvstore

[![npm version](https://badge.fury.io/js/orbit-db-kvstore.svg)](https://badge.fury.io/js/orbit-db-kvstore)

An append-only log with traversable history. Useful for *"latest N"* use cases or as a message queue.

Used in [orbit-db](https://github.com/haadcode/orbit-db).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Install
```
npm install orbit-db ipfs
```

## Usage

First, create an instance of OrbitDB:

```javascript
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfs = new IPFS()
const orbitdb = new OrbitDB(ipfs)
```

Get a log database and add an entry to it:

```javascript
const kv = orbitdb.kvstore('settings')
kv.set('volume', '100')
  .then(() => {
    console.log(kv.get('volume'))
    // 100
  })
```

Later, when the database contains data, load the history and query when ready:

```javascript
const kv = orbitdb.kvstore('settings')
kv.events.on('ready', () => {
  console.log(kv.get('volume'))
  // 100
})
```

## API

### kvstore(name)

  Package: 
  [orbit-db-kvstore](https://github.com/haadcode/orbit-db-kvstore)

  ```javascript
  const db = orbitdb.kvstore('application.settings')
  ```

  - **put(key, value)**
    ```javascript
    db.put('hello', { name: 'World' }).then(() => ...)
    ```

  - **set(key, value)**
    ```javascript
    db.set('hello', { name: 'Friend' }).then(() => ...)
    ```
    
  - **get(key)**
    ```javascript
    const value = db.get('hello')
    // { name: 'Friend' }
    ```

  - **events**

    ```javascript
    db.events.on('data', (dbname, event) => ... )
    ```

    See [Events](https://github.com/haadcode/orbit-db-store#events) for full description

## Contributing

See [orbit-db's contributing guideline](https://github.com/haadcode/orbit-db#contributing).

## License

[MIT](LICENSE) ©️ 2016 Haadcode
