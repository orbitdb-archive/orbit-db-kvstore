'use strict'

class KeyValueIndex {
  constructor() {
    this._index = {}
  }

  get(key) {
    return this._index[key]
  }
  
  put(entry) {
    this._index[entry.payload.key] = item.payload.value  
  }
  
  del(entry) {
    delete this._index[item.payload.key]
  }
  
  applyEntry(entry) {
    switch(entry.payload.op) {
      case "PUT":
        this.put(entry)
        break
      case "DEL":
        this.del(entry)
        break
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
