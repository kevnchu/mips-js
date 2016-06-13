// converts MIPS instructions into machine instructions / data
const fs = require('fs');
const scanner = require('./scanner');
const parser = require('./parser');
const instructions = require('./instructions');

const run = function (program) {
    const { text, data } = parser.parse(program);
    for (let line of data) {
        console.log(line);
    }
    for (let line of text) {
        console.log(line);
    }
};

if (require.main === module) {
    fs.readFile('./examples/simple.asm', 'utf8', (err, data) => {
        if (err) {
            // errback
            console.log(err);
            process.exit(-1);
        }
        run(data);
    });
}
