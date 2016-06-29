// constants
const {
  opcodeShift,
  rsShift,
  rtShift,
  rdShift,
  saShift,
  rsMask,
  rtMask,
  rdMask,
  saMask,
  funcMask,
  cMask,
  addrMask
} = require('./constants')

// Instruction types
// Type format (bits 31 - 0)
// R	opcode (6)	rs (5)	rt (5)	rd (5)	shamt (5)	funct (6)
// I	opcode (6)	rs (5)	rt (5)	immediate (16)
// J	opcode (6)	address (26)
const rEncode = function (opcode, rs, rt, rd, shamt, funct) {
  return ((opcode << opcodeShift) +
    (rs << rsShift) +
    (rt << rtShift) +
    (rd << rdShift) +
    (shamt << saShift) +
    funct) >>> 0
}

const iEncode = function (opcode, rs, rt, immediate) {
  return ((opcode << opcodeShift) +
    (rs << rsShift) +
    (rt << rtShift) +
    immediate) >>> 0
}

const jEncode = function (opcode, address) {
  return ((opcode << opcodeShift) + address) >>> 0
}

const rDecode = (instruction) => {
  return {
    opcode: instruction >>> opcodeShift,
    rs: (instruction >>> rsShift) & rsMask,
    rt: (instruction >>> rtShift) & rtMask,
    rd: (instruction >>> rdShift) & rdMask,
    shamt: (instruction >>> saShift) & saMask,
    funct: instruction & funcMask
  }
}

const iDecode = (instruction) => {
  return {
    opcode: instruction >>> opcodeShift,
    rs: (instruction >>> rsShift) & rsMask,
    rt: (instruction >>> rtShift) & rtMask,
    c: instruction & cMask
  }
}

const jDecode = (instruction) => {
  return {
    opcode: instruction >>> opcodeShift,
    address: instruction & addrMask
  }
}

// Arithmetic
// ADD, ADDI, SUB, MULT*, DIV*, SLT, SLTI
// Logic
// AND, ANDI, OR, ORI, NOR, XOR, SLL, SLLV, SRA, SRAV, SRL, SRLV
// Memory
// LB, SB, LW, SW, LI
// Control
// J, JAL, JALR, JR, BEQ, BNE, BLEZ, BGTZ
// Random
// SYSCALL, NOP, RFE, BREAK

const instructions = {
  // Arithmetic
  // 000000 01010 01011 01100 00000 100000   # add $12, $10, $11
  // 0      10    11    12    0     32
  'ADD': function (rd, rs, rt) {
    return rEncode(0, rs, rt, rd, 0, 0x20)
  },
  'ADDI': function (rt, rs, data) {
    return iEncode(0x8, rs, rt, data)
  },
  'SUB': function (rd, rs, rt) {
    return rEncode(0, rs, rt, rd, 0, 0x22)
  },
  'MULT': function (rs, rt) {
    return rEncode(0, rs, rt, 0, 0, 0x18)
  },
  'DIV': function (rs, rt) {
    return rEncode(0, rs, rt, 0, 0, 0x1a)
  },

  // Logical
  'SLT': function (rd, rs, rt) {
    return rEncode(0, rs, rt, rd, 0, 0x2a)
  },
  'SLTI': function (rt, rs, data) {
    return iEncode(0xa, rs, rt, data)
  },
  'AND': function (rd, rs, rt) {
    return rEncode(0, rs, rt, rd, 0, 0x24)
  },
  'ANDI': function (rt, rs, data) {
    return iEncode(0xc, rs, rt, data)
  },
  'OR': function (rd, rs, rt) {
    return rEncode(0, rs, rt, rd, 0, 0x25)
  },
  'ORI': function (rt, rs, data) {
    return iEncode(0xd, rs, rt, data)
  },
  'NOR': function (rd, rs, rt) {
    return rEncode(0, rs, rt, rd, 0, 0x27)
  },
  'XOR': function (rd, rs, rt) {
    return rEncode(0, rs, rt, rd, 0, 0x26)
  },

  // Bitwise shift
  'SLL': function (rd, rt, shamt) {
    return rEncode(0, 0, rt, rd, shamt, 0)
  },
  'SRL': function (rd, rt, shamt) {
    return rEncode(0, 0, rt, rd, shamt, 0x2)
  },
  'SLLV': function (rd, rt, rs) {
    return rEncode(0, rs, rt, rd, 0, 0x4)
  },
  'SRLV': function (rd, rt, rs) {
    return rEncode(0, rs, rt, rd, 0, 0x6)
  },
  'SRA': function (rd, rt, shamt) {
    return rEncode(0, 0, rt, rd, shamt, 0x3)
  },
  'SRAV': function (rd, rt, rs) {
    return rEncode(0, rs, rt, rd, 0, 0x7)
  },

  // memory
  // load byte: lb $rt,C($rs)
  'LB': function (rt, c, rs) {
    return iEncode(0x20, rs, rt, c)
  },
  // store byte: sb $t,C($s)
  'SB': function (rt, c, rs) {
    return iEncode(0x28, rs, rt, c)
  },
  // load word: lw $t,C($s)
  // 100011 11101 01000 0000000000000000   # lw $t0, 0($sp)
  // 35     29    8     0
  // 100011 11101 01001 0000000000000100   # lw $t1, 4($sp)
  // 35     29    9     4
  'LW': function (rt, c, rs) {
    return iEncode(0x23, rs, rt, c)
  },
  // store word: sw $t,C($s)
  'SW': function (rt, c, rs) {
    return iEncode(0x2b, rs, rt, c)
  },
  'LI': function (rt, c) {
    // # ori   $t0, $zero, 50
    return instructions.ORI(rt, 0, c)
  },
  'LUI': function (rt, c) {
    // load upper immediate
    // lui  $t0, C  # $t0 = C << 16
    return iEncode(0xf, 0, rt, c)
  },

  // conditional
  'BEQ': function (rs, rt, c) {
    return iEncode(0x4, rs, rt, c)
  },
  'BNE': function (rs, rt, c) {
    return iEncode(0x5, rs, rt, c)
  },

  // unconditional jump
  'J': function (c) {
    return jEncode(0x2, c)
  },
  'JR': function (rs) {
    return rEncode(0, rs, 0, 0, 0, 0x8)
  },
  'JAL': function (c) {
    return jEncode(0x3, c)
  },

  // TODO
  'SYSCALL': function () {
    return 12
  },
  rDecode,
  rEncode,
  iDecode,
  iEncode,
  jDecode,
  jEncode
}

if (require.main === module) {

}

module.exports = instructions
