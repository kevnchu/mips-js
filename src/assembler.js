// converts MIPS instructions into machine instructions / data
let fs = require('fs');

fs.readFile('./add.asm', (err, data) =>
    if (err) {
        // errback
        console.log(err);
        process.exit(-1);
    }
    console.log(data.readLines());
);