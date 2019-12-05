'use strict'

const Store = require('orbit-db-store')
const KeyValueIndex = require('./KeyValueIndex')

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
    return this._index.get(key)
  }

  set (key, data, options = {}) {
    return this.put(key, data, options)
  }

  put (key, data, options = {}) {
    return this._addOperation({
      op: 'PUT',
      key: key,
      value: data
    }, options)
  }

  del (key, options = {}) {
    return this._addOperation({
      op: 'DEL',
      key: key,
      value: null
    }, options)
  }
}

module.exports = KeyValueStore
