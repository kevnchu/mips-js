// MIPS 32 CPU

const textAddress = 0x400000
// const dataAddress = 0x10010000

class Cpu {
  constructor () {
    // 32KB ram
    this.ram = new Uint32Array(0x8000)
    this.registers = new Uint32Array(32)
    // where does pc start?
    // this.pc = 0x400000
    this.pc = textAddress
  }

  readMem (address) {
    return this.ram[address]
  }

  writeMem (address, b) {
    this.ram[address] = b
  }

  loop () {
    while (true) {
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
  }
}

module.exports = Cpu
