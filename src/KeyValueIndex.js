'use strict'

class KeyValueIndex {
  constructor(validationFn, store) {
    this._index = {}
    this._validationFn = validationFn
    this._store = store
  }

  get(key) {
    return this._index[key]
  }

  updateIndex(oplog) {
    oplog.values
      .slice()
      .reverse()
      .reduce((handled, item) => {
        if(!handled.includes(item.payload.key) && this._validationFn(item, store)) {
          handled.push(item.payload.key)
          if(item.payload.op === 'PUT') {
            this._index[item.payload.key] = item.payload.value
          } else if(item.payload.op === 'DEL') {
            delete this._index[item.payload.key]
          }
        }
        return handled
      }, [])
  }
}

module.exports = KeyValueIndex
