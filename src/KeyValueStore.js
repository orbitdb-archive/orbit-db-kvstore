'use strict'

const Store = require('orbit-db-store')
const KeyValueIndex = require('./KeyValueIndex')
const {Key, utils} = require('interface-datastore')
const {filter, sortAll, take, map} = utils

class KeyValueStore extends Store {
  constructor(ipfs, id, dbname, options) {
    let opts = Object.assign({}, { Index: KeyValueIndex })
    Object.assign(opts, options)
    super(ipfs, id, dbname, opts)
    this._type = 'keyvalue'
  }

  get all () {
    return this._index._index
  }

  get (key) {
    return this._index.get(key.toString())
  }

  set (key, data, options = {}) {
    return this.put(key.toString(), data, options)
  }

  put (key, data, options = {}) {
    return this._addOperation({
      op: 'PUT',
      key: key.toString(),
      value: data
    }, options)
  }
  del (key, options = {}) {
    return this._addOperation({
      op: 'DEL',
      key: key.toString(),
      value: null
    }, options)
  }

  /**
   * Query datastore via async iterable
   * NOTE: In compliance with interface-datastore specifications. Backwards compatible (without leading /) orbit-db keyvalues may not work as expected.
   * @param {Object} q 
   */
  query (q) {
    let it = Object.entries(this._index._index)

    it = map(it, entry => ({ key: new Key(entry[0]), value: entry[1] }))

    if (q.prefix != null) {
      it = filter(it, e => e.key.toString().startsWith(q.prefix))
    }

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sortAll(it, f), it)
    }

    if (q.offset != null) {
      let i = 0
      it = filter(it, () => i++ >= q.offset)
    }

    if (q.limit != null) {
      it = take(it, q.limit)
    }

    if (q.keysOnly === true) {
      it = map(it, e => ({ key: e.key }))
    }

    return it
  }
  batch () {
    let puts = []
    let dels = []

    return {
      put (key, value) {
        puts.push([key, value])
      },
      delete (key) {
        dels.push(key)
      },
      commit: async () => { // eslint-disable-line require-await
        //Future add support for multiples operations per oplog entry.
        puts.forEach(v => {
          await this.put(v[0], v[1])
        })
        puts = []

        dels.forEach(key => {
          await this.del(key)
        })
        dels = []
      }
    }
  }
}

module.exports = KeyValueStore
