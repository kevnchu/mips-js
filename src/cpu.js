// MIPS 32 CPU

const textAddress = 0x400000;
const dataAddress =  0x10010000;


const registerNames = [
    '$zero', '$at', '$v0', '$v1',
    '$a0', '$a1', '$a2', '$a3',
    '$t0', '$t1', '$t2', '$t3',
    '$t4', '$t5', '$t6', '$t7',
    '$s0', '$s1', '$s2', '$s3',
    '$s4', '$s5', '$s6', '$s7',
    '$t8', '$t9', '$k0', '$k1',
    '$gp', '$sp', '$fp', '$ra'
];
let registerIndices = {};
registerNames.forEach((name, index) => registerIndices[name] = index);

class Cpu {
    constructor() {
        // 32KB ram
        this.ram = new Uint32Array(0x8000);
        this.registers = new Uint32Array(32);
        // where does pc start?
        // this.pc = 0x400000;
        this.pc = textAddress;
    }
    
    readMem(address) {
        return this.ram[address];
    }
    
    writeMem(address, b) {
        this.ram[address] = b;
    }
    
    loop() {
        while (true) {
            // fetch instruction
            const instruction = this.readMem(this.pc);
            const opcode = instruction >> 25;
            switch (opcode) {
                case 0:
                    const funct = instruction & 0x3f;
                    switch (funct) {
                        case 0x20:
                            // add
                            break;
                    }
                case 0x8:

                case 0xa:

                case 0xc:
                case 0xd:

                case 0x20:
                case 0x28:
                case 0x23:
                case 0x2b:
                case 0x4:
                case 0x5:
                case 0x2:
                case 0x3:
            }
        }
    }
}