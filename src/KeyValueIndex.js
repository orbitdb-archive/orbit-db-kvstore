'use strict'

class KeyValueIndex {
  constructor() {
    this._index = {}
  }

  get(key) {
    return this._index[key]
  }

  updateIndex(oplog) {
    const values = oplog.values

    const handled = {}
    for (let i = values.length - 1; i >= 0; i--) {
      const item = values[i]
      if (handled[item.payload.key]) {
        return
      }
      handled[item.payload.key] = true
      if (item.payload.op === 'PUT') {
        this._index[item.payload.key] = item.payload.value
        return
      }
      if (item.payload.op === 'DEL') {
        delete this._index[item.payload.key]
        return
      }
    }
  }
}

module.exports = KeyValueIndex
