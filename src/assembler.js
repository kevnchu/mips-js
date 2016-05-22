// converts MIPS instructions into machine instructions / data
const fs = require('fs');
const scanner = require('./scanner');
const parser = require('./parser');
//const memory = require('./memory');

const run = function (program) {
    tokenGen = scanner.scan(program);
    parser.parse(tokenGen);
    
};

if (require.main === module) {
    console.log('attempting');
    fs.readFile('./examples/add.asm', 'utf8', (err, data) => {
        if (err) {
            // errback
            console.log(err);
            process.exit(-1);
        }
        run(data);
    });

}
