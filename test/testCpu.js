const assert = require('chai').assert
const Cpu = require('../src/cpu')
const registers = require('../src/registers')

describe('cpu.js', () => {
  it('initializes the PC')

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

  it('won\'t write to read only segments of memory')
  // () => {
    // const cpu = new Cpu()
    // let fn = cpu.writeMem.bind(cpu, -1, 0)
    // assert.throws(fn)
  // })

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
    assert.equal(cpu.registers[r1] << 0, -6)
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

  it('sllv', () => {
    // sllv $t0, $t1, $t2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    let r3 = registers.$t2
    cpu.registers[r2] = 13
    cpu.registers[r3] = 4
    cpu.readMem = () => 0x1494004
    cpu.step()
    assert.equal(cpu.registers[r1], 208)
  })

  it('srlv', () => {
    // srlv $t0, $t1, $t2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    let r3 = registers.$t2
    cpu.registers[r2] = 13
    cpu.registers[r3] = 2
    cpu.readMem = () => 0x1494006
    cpu.step()
    assert.equal(cpu.registers[r1], 3)
  })

  it('slt', () => {
    // slt $t0, $t1, $t2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    let r3 = registers.$t2
    cpu.registers[r2] = 13
    cpu.registers[r3] = 2
    cpu.readMem = () => 0x12a402a
    cpu.step()
    assert.equal(cpu.registers[r1], 0)

    cpu.registers[r2] = 13
    cpu.registers[r3] = 13
    cpu.step()
    assert.equal(cpu.registers[r1], 0)

    cpu.registers[r2] = 13
    cpu.registers[r3] = 14
    cpu.step()
    assert.equal(cpu.registers[r1], 1)
  })

  it('and', () => {
    // and $t0, $t1, $t2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    let r3 = registers.$t2
    cpu.registers[r2] = 3321
    cpu.registers[r3] = 243321
    cpu.readMem = () => 0x12a4024
    cpu.step()
    assert.equal(cpu.registers[r1], 1145)
  })

  it('or', () => {
    // and $t0, $t1, $t2
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    let r3 = registers.$t2
    cpu.registers[r2] = 3321
    cpu.registers[r3] = 243321
    cpu.readMem = () => 0x12a4025
    cpu.step()
    assert.equal(cpu.registers[r1], 245497)
  })

  it('slti', () => {
    // slti $t0, $t1, 34
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    cpu.registers[r2] = 13
    cpu.readMem = () => 0x29280022
    cpu.step()
    assert.equal(cpu.registers[r1], 1)

    cpu.registers[r2] = 34
    cpu.step()
    assert.equal(cpu.registers[r1], 0)

    cpu.registers[r2] = 35
    cpu.step()
    assert.equal(cpu.registers[r1], 0)
  })

  it('andi', () => {
    // andi $t0, $t1, 2345
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    cpu.readMem = () => 0x31280929
    cpu.registers[r2] = 13
    cpu.step()
    assert.equal(cpu.registers[r1], 9)

    cpu.registers[r2] = 16
    cpu.step()
    assert.equal(cpu.registers[r1], 0)
  })

  it('ori', () => {
    // ori $t0, $t1, 732
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    cpu.readMem = () => 0x352802dc
    cpu.registers[r2] = 35
    cpu.step()
    assert.equal(cpu.registers[r1], 767)

    cpu.registers[r2] = 16
    cpu.step()
    assert.equal(cpu.registers[r1], 732)
  })

  it('lui')

  it('lb', () => {
    // TODO handle optional offset
    // lb $t0, 0($t1)
    const cpu = new Cpu()
    let r1 = registers.$t0
    let r2 = registers.$t1
    cpu.getInstruction = () => 0x81280000
    cpu.registers[r2] = 0x12121212
    cpu.registers[r2] = 0x10000000 // should map to index 0 in memory
    cpu.memory[8192] = 0x88776655 // memory contents
    cpu.step()
    console.log(cpu.registers)
    assert.equal(cpu.registers[r1], 0xffffff88)
  })

  it('sb')

  it('syscall', () => {
    const cpu = new Cpu()
    let r2 = registers.$a0
    cpu.registers[r2] = 7
    cpu.getInstruction = () => 0xc
    cpu.step()
    // console.log called with 7
  })
})
