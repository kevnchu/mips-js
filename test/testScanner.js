const assert = require('chai').assert
const scanner = require('../src/scanner')

describe('scanner.js', () => {
  describe('scan', () => {
    it('should tokenize ints', () => {
      const str = '123'
      const tokenGen = scanner.scan(str)
      const token = tokenGen.next().value
      assert.equal(token.value, 123)
      assert.equal(token.type, 'int')
    })

    it('should tokenize negative ints', () => {
      const str = '-123'
      const tokenGen = scanner.scan(str)
      const token = tokenGen.next().value
      assert.equal(token.value, -123)
      assert.equal(token.type, 'int')
    })

    it('should tokenize identifiers', () => {
      const str = 'foo:'
      const tokenGen = scanner.scan(str)
      const token = tokenGen.next().value
      assert.equal(token.value, 'foo')
      assert.equal(token.type, 'identifier')
    })

    it('ignores comments', () => {
      const str = 'abc  # fgh'
      const tokenGen = scanner.scan(str)
      let iterValue = tokenGen.next()
      iterValue = tokenGen.next()
      assert(iterValue.done)
    })

    it('tokenizes strings', () => {
      const str = '   ".text # program instructions"  # comment'
      const tokenGen = scanner.scan(str)
      const token = tokenGen.next().value
      assert.equal(token.value, '".text # program instructions"')
      assert.equal(token.type, 'string')
    })

    it('tokenizes directives', () => {
      const str = '   .text # program instructions'
      const tokenGen = scanner.scan(str)
      const token = tokenGen.next().value
      assert.equal(token.value, '.text')
      assert.equal(token.type, 'directive')
    })

    it('tokenizes special characters', () => {
      const str = ':*/∫∆INST 4($gp)'
      const tokenGen = scanner.scan(str)
      let token = tokenGen.next().value
      assert.equal(token.value, ':')
      assert.equal(token.type, 'ascii')
      token = tokenGen.next().value
      assert.equal(token.value, '*')
      assert.equal(token.type, 'ascii')
    })

    it('tokenizes register offsets', () => {
      const str = '4($gp)'
      const tokenGen = scanner.scan(str)
      let token = tokenGen.next().value
      assert.equal(token.value, 4)
      assert.equal(token.type, 'int')
      token = tokenGen.next().value
      assert.equal(token.value, '(')
      assert.equal(token.type, 'ascii')
      token = tokenGen.next().value
      assert.equal(token.value, '$gp')
      assert.equal(token.type, 'register')
      token = tokenGen.next().value
      assert.equal(token.value, ')')
      assert.equal(token.type, 'ascii')
    })
  })
})
