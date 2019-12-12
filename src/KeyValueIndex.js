'use strict'

class KeyValueIndex {
  constructor() {
    this._index = {}
    this._lastProcessedIdx = 0
  }

  get(key) {
    return this._index[key]
  }

  updateIndex(oplog) {
    oplog.values
      .slice(this._lastProcessedIdx, oplog.values.length)
      .reverse()
      .reduce((handled, item, idx) => {
        if(!handled.includes(item.payload.key)) {
          handled.push(item.payload.key)
          if(item.payload.op === 'PUT') {
            this._index[item.payload.key] = item.payload.value
          } else if(item.payload.op === 'DEL') {
            delete this._index[item.payload.key]
          }
        }
        this._lastProcessedIdx += idx
        return handled
      }, [])
  }
}

module.exports = KeyValueIndex
