// MIPS 32 CPU
const registers = require('./registers').registerIndices

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
    this.memory = new Uint32Array(memSpace)
    this.registers = new Uint32Array(registerCount)
    this.pc = textAddress

    this.registers[registers.$gp] = 0x10008000
  }

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

  step () {
    // fetch instruction
    const instruction = this.readMem(this.pc)
    const opcode = instruction >> 25
    switch (opcode) {
      case 0:
        const funct = instruction & 0x3f
        switch (funct) {
          case 0x20:
            // add
            break
        }
        break
      case 0x8:
        break
      case 0xa:
        break
      case 0xc:
        break
      case 0xd:
        break
      case 0x20:
        break
      case 0x28:
        break
      case 0x23:
        break
      case 0x2b:
        break
      case 0x4:
        break
      case 0x5:
        break
      case 0x2:
        break
      case 0x3:
      default:
        break
    }
  }

  loop () {
    while (true) {
      this.step()
    }
  }
}

module.exports = Cpu
