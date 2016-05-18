// MIPS 32 CPU

class Cpu {
    constructor() {
        const names = [
            '$zero',
            '$at',
            '$v0',
            '$v1',
            '$a0',
            '$a1',
            '$a2',
            '$a3',
            '$t0',
            '$t1',
            '$t2',
            '$t3',
            '$t4',
            '$t5',
            '$t6',
            '$t7',
            '$s0',
            '$s1',
            '$s2',
            '$s3',
            '$s4',
            '$s5',
            '$s6',
            '$s7',
            '$t8',
            '$t9',
            '$k0',
            '$k1',
            '$gp',
            '$sp',
            '$fp',
            '$ra'
        ];
        let registerMap = {};
        names.forEach((name, index) => registerMap[name] = index);
        let registers = new Uint32Array(32);
        this.registerMap = registerMap;
        this.registers = registers;
    }
}