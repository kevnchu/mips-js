// MIPS 32 CPU
const registers = require('./registers')
const { rDecode, iDecode } = require('./instructions')
let { opcodeShift } = require('./constants')

// memory segments
// const textAddress = 0x400000
// const dataAddress = 0x10010000
const textAddress = 0

// system params
const memSpace = 8192 * 2 + 588
const registerCount = 0x20

const signExtend16 = (num) => {
  let value = (num & 0xffff)
  const sign = num & 0x8000
  if (sign) {
    value += 0xffff0000
  }
  return value
}

class Cpu {
  constructor () {
    // 32KB ram
    this.memory = new Uint32Array(memSpace)
    this.registers = new Uint32Array(registerCount)
    this.pc = textAddress

    // memory map:
    // 0x00400000 - 0x00440000 user text segment (8192 words)
    // 0x10000000 - 0x1003ffff user data 2048 kb (8192 words)
    // 0x7ffff6d0 - 0x80000000 stack 2352 bytes (588 words)

    this.registers[registers.$gp] = 0x10008000
    this.registers[registers.$sp] = 0x7ffff6d0
  }

  // TODO figure out memory model
  loadProgram (instructions) {
    let addr = textAddress
    instructions.forEach((x, i) => {
      this.writeMem(addr, x)
      addr = (addr + 0x20) >>> 0
    })
  }

  // translates virtual address to physical address
  addressMap (address) {
    if (address >= 0x00400000 && address < 0x00440000) {
      address -= 0x00400000
    } else if (address >= 0x10000000 && address < 0x1003ffff) {
      // user data segments
      address -= 0x10000000 - 0x40000
    } else if (address >= 0x7ffff6d0 && address < 0x80000000) {
      // stack segment
      address -= 0x7ffff6d0
    } else {
      throw new Error('Segmentation fault ' + address)
    }
    return address >>> 5
  }

  // read word from memory
  // accessLen is length in bytes (1,2,3,4)
  readMem (address, accessLen = 4) {
    const word = this.memory[address]
    let mask = 0
    for (let i = 0; i < accessLen; i++) {
      mask = mask << 8
      mask += 0xff
    }
    return word & mask
  }

  // writes data to 'physical' address
  writeMem (address, data, accessLen) {
    if (address < 0 || address >= this.memory.length) {
      throw new Error(`Invalid memory address ${address}`)
    }
    this.memory[address] = data
  }

  getInstruction () {
    return this.readMem(this.pc)
  }

  syscall () {
    const callCode = this.registers[registers.$v0]
    const arg = this.registers[registers.$a0]
    switch (callCode) {
      case 1:
        // print int
        console.log(arg)
        break
      case 4:
        // print string
        // const str = this.readMem(arg)
        // console.log(str)
        break
      case 11:
        // print char
        console.log(String.fromCharCode(arg))
        break
    }
  }

  step () {
    // fetch instruction
    let incPc = true
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
        case 0x8:
          // jr
          // Jump to the effective target address in GPR rs. Execute the instruction following the jump, in the branch delay slot, before jumping
          this.pc = this.registers[rs]
          incPc = false
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
        case 0xc:
          this.syscall()
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
        case 0xf:
          // lui
          this.registers[rt] = c << 16
          break
        case 0x20: {
          // lb $t,C($s)
          // vAddr ← sign_extend(offset) + GPR[base]
          // (pAddr, CCA)← AddressTranslation (vAddr, DATA, LOAD)
          // pAddr ← pAddrPSIZE-1..2 || (pAddr1..0 xor ReverseEndian2)
          // memword← LoadMemory (CCA, BYTE, pAddr, vAddr, DATA)
          // byte ← vAddr1..0 xor BigEndianCPU2
          // GPR[rt]← sign_extend(memword7+8*byte..8*byte)
          const offset = signExtend16(c)
          let vAddr = this.registers[rs] + offset
          let pAddr = this.addressMap(vAddr)
          let word = this.readMem(pAddr)
          let mask = 0xff << (8 * offset)
          let byte = (word & mask) >> (8 * offset)
          this.registers[rt] = byte
          break
        }
        case 0x28: {
          // sb
          // stores the least-significant 8-bit of a register (a byte) into: MEM[$s+C].
          // this.writeMem(rs + c, rt & 0xff)

          // vAddr ← sign_extend(offset) + GPR[base]
          // (pAddr, CCA)← AddressTranslation (vAddr, DATA, STORE)
          // pAddr ← pAddrPSIZE-1..2 || (pAddr1..0 xor ReverseEndian2)
          // bytesel ← vAddr1..0 xor BigEndianCPU2
          // dataword ← GPR[rt]31–8*bytesel..0 || 08*bytesel
          // StoreMemory (CCA, BYTE, dataword, pAddr, vAddr, DATA)
          const offset = signExtend16(c)
          let vAddr = this.registers[rs] + offset
          let pAddr = this.addressMap(vAddr)
          let byte = this.registers[rt] & 0xff
          // TODO write byte only.
          this.writeMem(pAddr, byte, 1)
          break
        }
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
    if (incPc) {
      this.pc = (this.pc + 0x20) >>> 0
    }
  }

  loop () {
    while (true) {
      this.step()
    }
  }
}

module.exports = Cpu
