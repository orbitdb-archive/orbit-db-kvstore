import Store from 'orbit-db-store'
import KeyValueIndex from './KeyValueIndex.js'

export default class KeyValueStore extends Store {
  constructor (ipfs, id, dbname, options) {
    const opts = Object.assign({}, { Index: KeyValueIndex })
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
      key,
      value: data
    }, options)
  }

  del (key, options = {}) {
    return this._addOperation({
      op: 'DEL',
      key,
      value: null
    }, options)
  }
}
