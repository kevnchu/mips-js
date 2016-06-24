const assert = require('chai').assert
const Cpu = require('../src/cpu')
const registers = require('../src/registers')

describe('cpu.js', () => {
  it('initializes the PC', () => {
    // const cpu = new Cpu()
    // assert.equal(cpu.pc, 0x400000)
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
    // const cpu = new Cpu()
    // let fn = cpu.writeMem.bind(cpu, -1, 0)
    // assert.throws(fn)
  })

  it('executes instructions', () => {
    const cpu = new Cpu()
    // li $t1, 12
    // addi $t0, $t1, 20
    let program = [873005068, 556269588]
    cpu.readMem = () => program[0]
    cpu.step()
    cpu.readMem = () => program[1]
    cpu.step()
    assert.equal(cpu.registers[registers.$t0], 32)
  })

  it('add', () => {
    // add $t0, $t1, $t2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    let r3 = registers.$t2
    cpu.registers[r1] = 9
    cpu.registers[r2] = 4
    cpu.registers[r3] = 10
    cpu.readMem = () => 0x12a4020
    cpu.step()
    assert.equal(cpu.registers[r1], 14)
  })

  it('sub', () => {
    // sub $t0, $t1, $t2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    let r3 = registers.$t2
    cpu.registers[r1] = 2355
    cpu.registers[r2] = 234
    cpu.registers[r3] = 35
    cpu.readMem = () => 0x12a4022
    cpu.step()
    assert.equal(cpu.registers[r1], 199)

    cpu.registers[r2] = 4
    cpu.registers[r3] = 10
    cpu.step()
    assert.equal(cpu.registers[r1], -6)
  })

  it('addi', () => {
    // addi $t0, $t1, 23434
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    cpu.registers[r2] = 4
    cpu.readMem = () => 0x21285b8a
    cpu.step()
    assert.equal(cpu.registers[r1], 23438)
  })

  it('sll', () => {
    // sll $t0, $t1, 4
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    cpu.registers[r2] = 13
    cpu.readMem = () => 0x94100
    cpu.step()
    assert.equal(cpu.registers[r1], 208)
  })

  it('srl', () => {
    // srl $t0, $t1, 2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    cpu.registers[r2] = 13
    cpu.readMem = () => 0x94082
    cpu.step()
    assert.equal(cpu.registers[r1], 3)
  })

  // it('sllv', () => {

  // })

  // it('srlv', () => {

  // })

  // it('slt', () => {

  // })

  // it('and', () => {

  // })

  // it('or', () => {

  // })

  // it('slti', () => {

  // })

  // it('andi', () => {

  // })

  // it('ori', () => {

  // })

  // it('ori', () => {

  // })

  // it('lb', () => {

  // })

  // it('sb', () => {

  // })
})
