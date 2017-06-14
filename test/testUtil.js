import { assert } from 'chai'
import util from '../src/util'

describe('util.js', () => {
  describe('generatorAdapter', () => {
    it('should iterate over chars in a string', () => {
      const str = 'abc'
      let {getNext} = util.generatorAdapter(str)
      assert.equal(getNext(), 'a')
      assert.equal(getNext(), 'b')
      assert.equal(getNext(), 'c')
    })

    it('should peek ahead one character', () => {
      const str = 'abc'
      let {getNext, peek} = util.generatorAdapter(str)
      assert.equal(peek(), 'a')
      assert.equal(getNext(), 'a')
      assert.equal(peek(), 'b')
      assert.equal(getNext(), 'b')
      assert.equal(peek(), 'c')
      assert.equal(getNext(), 'c')
    })
  })
})
