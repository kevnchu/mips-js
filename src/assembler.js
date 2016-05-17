// converts MIPS instructions into machine instructions / data
let fs = require('fs');


let run = function (program) {
    // scan
    // let tokens = tokenize(lines);
    // parse
    
    // start instruction cycle
    // fetch instruction
    // execute
};

fs.readFile('./examples/add.asm', 'utf8', (err, data) => {
    if (err) {
        // errback
        console.log(err);
        process.exit(-1);
    }
    run(data);
});

// Instruction types
// Type format (bits 31 - 0)
// R	opcode (6)	rs (5)	rt (5)	rd (5)	shamt (5)	funct (6)
// I	opcode (6)	rs (5)	rt (5)	immediate (16)
// J	opcode (6)	address (26)
