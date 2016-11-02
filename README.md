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

    See [events](#stores) for full description.

### events

  Eventlog has an `events` ([EventEmitter](https://nodejs.org/api/events.html)) object that emits events that describe what's happening in the database.

  - `data` - (dbname, event)
    
    Emitted after an entry was added to the database

    ```javascript
    db.events.on('data', (dbname, event) => ... )
    ```

  - `sync` - (dbname)

    Emitted before starting a database sync with a peer.

    ```javascript
    db.events.on('sync', (dbname) => ... )
    ```

  - `load` - (dbname, hash)

    Emitted before loading the database history. *hash* is the hash from which the history is loaded from.

    ```javascript
    db.events.on('load', (dbname, hash) => ... )
    ```

  - `history` - (dbname, entries)

    Emitted after loading the database history. *entries* is an Array of entries that were loaded.

    ```javascript
    db.events.on('history', (dbname, entries) => ... )
    ```

  - `ready` - (dbname)

    Emitted after fully loading the database history.

    ```javascript
    db.events.on('ready', (dbname) => ... )
    ```

  - `write` - (dbname, hash)

    Emitted after an entry was added locally to the database. *hash* is the IPFS hash of the latest state of the database.

    ```javascript
    db.events.on('write', (dbname, hash) => ... )
    ```

## Contributing

See [orbit-db's contributing guideline](https://github.com/haadcode/orbit-db#contributing).

## License

[MIT](LICENSE) ©️ 2016 Haadcode
