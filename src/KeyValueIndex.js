'use strict'

class KeyValueIndex {
  constructor() {
    this._index = {}
  }

  get(key) {
    return this._index[key]
  }
  
  applyEntry(entry) {
    if(item.payload.op === "PUT") {
      this._index[entry.payload.key] = item.payload.value
    } else if(item.payload.op === "DEL") {
      delete this._index[item.payload.key] 
    }
  }

  updateIndex(oplog) {
    oplog.values
      .slice()
      .reverse()
      .reduce((handled, item) => {
        if(!handled.includes(item.payload.key)) {
          handled.push(item.payload.key)
          this.applyEntry(item)
        }
        return handled
      }, [])
  }
}

module.exports = KeyValueIndex
