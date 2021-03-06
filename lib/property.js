'use strict'

const CollectionItem = require('./collection-item')
const parsers = require('./parsers')

const pattern = /<code>.*?\.(?:(\w+)\.)?(\w+)<\/code>/
const typePattern = /An? ([a-zA-Z]+(?:<[a-zA-Z[\]]+>)?(?:\[])?) ?/
const props = ['name', 'description', 'type', 'innerType', 'collection', '_superObject']

module.exports = class Property extends CollectionItem {
  constructor (api, el) {
    super(api, el, pattern, props)

    if (this.match) {
      this.name = this.match[2]
      if (this.match[1]) this._superObject = this.match[1]
      this.description = this.getDescription()
      this.type = null
      const typeMatch = typePattern.exec(this.description)
      if (typeMatch) {
        const typeInfo = parsers.getInnerType(parsers.stripArrTags(typeMatch[1]))
        this.type = typeInfo.outer
        this.innerType = typeInfo.inner
        this.collection = typeMatch[1].endsWith('[]')
      }
    }

    return this
  }
}
