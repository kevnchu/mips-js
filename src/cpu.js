// MIPS 32 CPU
const registers = require('./registers')
const { rDecode, iDecode } = require('./instructions')
let { opcodeShift } = require('./constants')

// memory segments
// const textAddress = 0x400000
// const dataAddress = 0x10010000
const textAddress = 0

// system params
const memSpace = 0x8000
const registerCount = 0x20

class Cpu {
  constructor () {
    // 32KB ram
    // this should be byte addressable. use Int8Array?
    this.memory = new Uint32Array(memSpace)
    this.registers = new Uint32Array(registerCount)
    this.pc = textAddress

    this.registers[registers.$gp] = 0x10008000
  }

  // TODO figure out memory model
  loadProgram (instructions) {
    let addr = textAddress
    instructions.forEach((x, i) => {
      this.writeMem(addr, x)
      addr = (addr + 0x20) >>> 0
    })
  }

  readMem (address) {
    return this.memory[address]
  }

  writeMem (address, b) {
    // TODO check if memory is writable
    this.memory[address] = b
  }

  getInstruction () {
    return this.readMem(this.pc)
  }

  step () {
    // fetch instruction
    const instruction = this.getInstruction()
    const opcode = instruction >>> opcodeShift
    if (opcode === 0) {
      // r format
      let { rs, rt, rd, shamt, funct } = rDecode(instruction)
      switch (funct) {
        case 0:
          // sll
          this.registers[rd] = this.registers[rt] << shamt
          break
        case 0x2:
          // srl
          this.registers[rd] = this.registers[rt] >> shamt
          break
        case 0x3:
          // sra
          break
        case 0x4:
          // sllv
          this.registers[rd] = this.registers[rt] << this.registers[rs]
          break
        case 0x6:
          // srlv
          this.registers[rd] = this.registers[rt] >> this.registers[rs]
          break
        case 0x7:
          // srav
          break
        case 0x20:
          // add
          this.registers[rd] = this.registers[rs] + this.registers[rt]
          break
        case 0x22:
          // sub
          this.registers[rd] = this.registers[rs] - this.registers[rt]
          break
        case 0x18:
          // mult
          // TODO
          break
        case 0x1a:
          // div
          // TODO
          break
        case 0x2a:
          // slt
          this.registers[rd] = this.registers[rs] < this.registers[rt] ? 1 : 0
          break
        case 0x24:
          // and
          this.registers[rd] = this.registers[rs] & this.registers[rt]
          break
        case 0x25:
          // or
          this.registers[rd] = this.registers[rs] | this.registers[rt]
          break
        default:
          // not implemented
          console.error('func not implemented')
          break
      }
    } else if (opcode === 2) {
      // j
    } else if (opcode === 3) {
      // jal
    } else {
      // i format
      let { rs, rt, c } = iDecode(instruction)
      switch (opcode) {
        case 0x8:
          // addi
          this.registers[rt] = this.registers[rs] + c
          break
        case 0xa:
          // slti
          this.registers[rt] = this.registers[rs] < c
          break
        case 0xc:
          // andi
          this.registers[rt] = this.registers[rs] & c
          break
        case 0xd:
          // ori
          this.registers[rt] = this.registers[rs] | c
          break
        case 0x20:
          // lb $t,C($s)
          // TODO
          this.registers[rt] = this.readMem(this.registers[rs] + c) & 0xff
          break
        case 0x28:
          // sb
          // stores the least-significant 8-bit of a register (a byte) into: MEM[$s+C].
          // this.writeMem(rs + c, rt & 0xff)
          break
        case 0x23:
          // lw
          this.registers[rt] = this.readMem(rs + c)
          break
        case 0x2b:
          // sw
          // this.writeMem(rs + c, rt)
          break
        case 0x4:
          // beq
          break
        case 0x5:
          // bne
          break
        default:
          console.error('opcode not implemented')
          break
      }
    }
    this.pc = (this.pc + 0x20) >>> 0
  }

  loop () {
    while (true) {
      this.step()
    }
  }
}

module.exports = Cpu
