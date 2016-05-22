// Instruction types
// Type format (bits 31 - 0)
// R	opcode (6)	rs (5)	rt (5)	rd (5)	shamt (5)	funct (6)
// I	opcode (6)	rs (5)	rt (5)	immediate (16)
// J	opcode (6)	address (26)

const rFormat = function (opcode, rs, rt, rd, shamt, funct) {
    return (opcode << 25) +
        (rs << 20) +
        (rt << 15) +
        (rd << 10) +
        (shamt << 5) +
        funct;
};

const iFormat = function (opcode, rs, rt, immediate) {
    return (opcode << 25) +
        (rs << 20) +
        (rt << 15) +
        immediate;
};

const jFormat = function (opcode, address) {
    return (opcode << 25) + address;
};

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
    'ADD': function (rd, rs, rt) {
        return rFormat(0, rs, rt ,rd, 0, 0x20);
    },
    'ADDI': function (rt, rs, data) {
        return iFormat(0x8, rs, rt, data);
    },
    'SUB': function (rd, rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x22);
    },
    'MULT': function (rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x18);
    },
    'DIV': function (rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x1a);        
    },
    
    // Logical
    'SLT': function (rd, rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x2a);
    },
    'SLTI': function (rt, rs, data) {
        return iFormat(0xa, rs, rt, data);
    },
    'AND': function (rd, rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x24);
    },
    'ANDI': function (rt, rs, data) {
        return iFormat(0xc, rs, rt, data);
    },
    'OR': function (rd, rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x25);
    },
    'ORI': function (rt, rs, data) {
        return iFormat(0xd, rs, rt, data);
    },
    'NOR': function (rd, rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x27);
    },
    'XOR': function (rd, rs, rt) {
        return rFormat(0, rs, rt, rd, 0, 0x26);
    },
    
    // Bitwise shift
    'SLL': function (rd, rt, shamt) {
        return rFormat(0, 0, rt, rd, shamt, 0);
    },
    'SRL': function (rd, rt, shamt) {
        return rFormat(0, 0, rt, rd, shamt, 0x2);
    },
    'SLLV': function (rd, rt, rs) {
        return rFormat(0, rs, rt, rd, 0, 0x4);
    },
    'SRLV': function (rd, rt, rs) {
        return rFormat(0, rs, rt, rd, 0, 0x6);
    },
    'SRA': function (rd, rt, shamt) {
        return rFormat(0, 0, rt, rd, shamt, 0x3);
    },
    'SRAV': function (rd, rt, rs) {
        return rFormat(0, rs, rt, rd, 0, 0x7);
    },
    
    
    // memory
    // load byte: lb $rt,C($rs)
    'LB': function (rt, c, rs) {
        return iFormat(0x20, rs, rt, c);
    },
    // store byte: sb $t,C($s)
    'SB': function (rt, c, rs) {
        return iFormat(0x28, rs, rt, c);
    },
    // load word: lw $t,C($s)
    'LW': function (rt, c, rs) {
        return iFormat(0x23, rs, rt, c);
    },
    // store word: sw $t,C($s)
    'SW': function (rt, c, rs) {
        return iFormat(0x2b, rs, rt, c);
    },
    'LI': function () {
        // TODO pseudo instruction
    },
    
    // conditional
    'BEQ': function (rs, rt, c) {
        return iFormat(0x4, rs, rt, c);
    },
    'BNE': function (rs, rt, c) {
        return iFormat(0x5, rs, rt, c);
    },
    
    // unconditional jump
    'J': function (c) {
        return jFormat(0x2, c);
    },
    'JR': function (rs) {
        return rFormat(0, rs, 0, 0, 0, 0x8);
    },
    'JAL': function (c) {
        return jFormat(0x3, c)
    }
};

module.exports = instructions;
