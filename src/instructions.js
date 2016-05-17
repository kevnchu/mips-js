// Arithmetic
// ADD, ADDI, SUB, MULT*, DIV*, SLT, SLTI
// Logic
// AND, ANDI, OR, ORI, AND, XOR, SLL, SLLV, SRA, SRAV, SRL, SRLV, XOR, XORI
// Memory
// LB, SB, LW, SW
// Control
// J, JAL, JALR, JR, BEQ, BNE, BLEZ, BGTZ
// Random
// SYSCALL, NOP, RFE, BREAK

let instructions = {
    'ADD': function (rd, rs, rt) {
        return R(0x20, rs, rt ,rd, 0, 0);
    },
    'ADDI': function (rt, rs, data) {
        return I(0x8, rs, rt, data)
    }
};

// instruction formats:
let R = function (opcode, rs, rt, rd, shamt, funct) {
    return opcode << 25 +
        rs << 20 +
        rt << 15 +
        rd << 10 +
        shamt << 5 +
        funct;
}

let I = function (opcode, rs, rt, immediate) {
    
}

let J = function (opcode, address) {
    
}