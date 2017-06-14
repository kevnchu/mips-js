// const assert = require('chai').assert
// const Assembler = require('../src/assembler')
import { assert } from 'chai'
import Assembler from '../src/assembler'

describe('assembler.js', () => {
  it('encodes r-form instructions', () => {
    const instruction = 'jr $t0'
    const binary = 0x1000008
    const assembler = new Assembler()
    assembler.compile(instruction)
    assert(assembler.instructionTable._default[0], binary)
  })

  it('encodes i-form instructions', () => {
    const instruction = 'addi $t0, $a0, 55'
    const binary = 0x20880037
    const assembler = new Assembler()
    assembler.compile(instruction)
    assert(assembler.instructionTable._default[0], binary)
  })

  it('encodes j-form instructions')
})
