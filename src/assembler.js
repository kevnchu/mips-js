// converts MIPS instructions into machine instructions / data
const fs = require('fs');
const scanner = require('./scanner');
const parser = require('./parser');
const instructions = require('./instructions');

const run = function (program) {
    const data = parser.parse(program);
    for (let line of data) {
        console.log('instruction:', line.value);
        let args = line.args.map((x) => x && x.value);
        console.log('args:', args);
    }
};

if (require.main === module) {
    fs.readFile('./examples/factorial.asm', 'utf8', (err, data) => {
        if (err) {
            // errback
            console.log(err);
            process.exit(-1);
        }
        run(data);
    });
}
