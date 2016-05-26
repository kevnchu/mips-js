// MIPS 32 CPU

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
        this.pc = readMem(0xffffffff);
    }
    
    readMem(address) {
        return this.ram[address];
    }
    
    writeMem(address, b) {
        this.ram[address] = b;
    }
    
    loop() {
        let self = this;
        return function* () {
        while (true) {
            // fetch instruction
            const opcode = this.readMem(this.pc);
            this.pc++;
            switch (opcode) {
                // TODO implement opcodes
                case 0x0000:
                default:
                    // update hook 
                    break;
            }
        }
        
    }
}