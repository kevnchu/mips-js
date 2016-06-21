const assert = require('chai').assert
const Cpu = require('../src/cpu')
const { registerIndices } = require('../src/registers')

describe('cpu.js', () => {
  it('initializes the PC', () => {
    const cpu = new Cpu()
    assert.equal(cpu.pc, 0x400000)
  })

  it('initializes $gp', () => {
    const cpu = new Cpu()
    assert.equal(cpu.registers[28], 0x10008000)
  })

  it('loads program to proper memory segment', () => {
    const cpu = new Cpu()
    // li $t1, 12
    // addi $t0, $t1, 20
    let program = [873005068, 556269588]
    cpu.loadProgram(program)
    assert.equal(cpu.memory[0], program[0])
    assert.equal(cpu.memory[0x20], program[1])
  })

  it('won\'t write to read only segments of memory', () => {
    const cpu = new Cpu()
    let fn = cpu.writeMem.bind(cpu, -1, 0)
    assert.throws(fn)
  })

  it('executes instructions', () => {
    const cpu = new Cpu()
    // li $t1, 12
    // addi $t0, $t1, 20
    let program = [873005068, 556269588]
    cpu.readMem = () => 873005068
    cpu.step()
    cpu.readMem = () => 556269588
    cpu.step()
    assert.equal(cpu.registers[registerIndices.$t0], 32)
  })
})
