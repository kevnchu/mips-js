const assert = require('chai').assert
const parser = require('../src/parser')

describe('parser.js', () => {
  describe('parse', () => {
    it('parses instructions', () => {
      let str = '.text\naddi $a0, $t1, 4($t2)'
      let { text } = parser.parse(str)
      let args = text[0].args
      assert.equal(text[0].value, 'addi')
      assert.equal(args.length, 4)

      str = '.text\nj foo'
      text = parser.parse(str).text
      args = text[0].args
      assert.equal(text[0].value, 'j')
      assert.equal(args.length, 1)
      assert.equal(args[0].value, 'foo')
    })

    it('separates data and text segments', () => {
      let str = '.text\n j foo'
      let { text } = parser.parse(str)
      assert.equal(text[0].value, 'j')

      str = '.data\nfoo: .asciiz "hello world"'
      let { data } = parser.parse(str)
      assert.equal(data[0].value, 'foo')

      str = `.data
        foo: .asciiz "hello world"
        .text
        syscall`
      let output = parser.parse(str)
      data = output.data
      text = output.text
      assert.equal(data[0].value, 'foo')
      assert.equal(text[0].value, 'syscall')
    })

    it('parses data declarations', () => {
      let str = '.data msg: .asciiz "test message"'
      let { data } = parser.parse(str)
      assert.equal(data[0].value, 'msg')
      assert.equal(data[0].type, '.asciiz')
      assert.equal(data[0].data[0].value, '"test message"')

      str = '.data value: .word 15'
      data = parser.parse(str).data
      assert.equal(data[0].type, '.word')
      assert.equal(data[0].data[0].value, 15)

      // TODO test data sequence
    })

    it('parses text label', () => {
      let str = '.text main:'
      let { text } = parser.parse(str)
      assert.equal(text[0].value, 'main')
      assert.equal(text[0].type, 'label')
    })

    it('parses instruction arguments', () => {
      // TODO
    })

    it('parses hex arguments', () => {
      let str = 'li $t2 0x19'
      let { text } = parser.parse(str)
      let args = text[0].args
      assert.equal(args.length, 2)
      assert.equal(args[1].value, 25)
    })
  })
})

