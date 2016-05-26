// converts MIPS instructions into machine instructions / data
const fs = require('fs');
const scanner = require('./scanner');
const parser = require('./parser');
const instructions = require('./instructions');

const run = function (program) {
    // let tokenGen = scanner.scan(program);
    let lines = scanner.scan(program);
    let definitions = {};
    // parser.parse(tokenGen);
};

if (require.main === module) {
    fs.readFile('./examples/add.asm', 'utf8', (err, data) => {
    // fs.readFile('./examples/simple.asm', 'utf8', (err, data) => {
        if (err) {
            // errback
            console.log(err);
            process.exit(-1);
        }
        run(data);
    });

}
