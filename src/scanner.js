const instructions = require('./instructions')

// token classes
//// TODO finalize token classes
const labelRe = /^[A-z0-9]+\s*:\s*$/;
const directiveRe = /^\.[A-z]+/;
const numericalConstantRe = /^(\d+|0x[0-9a-f]+)$/i;

const isInstruction = (str) => {
    return instructions.hasOwnProperty(str.toUpperCase());
};

// trim whitespace, strip comments
const sanitize = (str) => {
    const commentIndex = str.indexOf('#');
    if (commentIndex >= 0) {
        str = str.substr(0, commentIndex);
    }
    return str.trim();
};

const scan = function* (program) {
    const lines = program.split('\n');
    for (let text of lines) {
        text = sanitize(text);
        const words = text.split(/[,\s]+/);
        console.log(words);
        for (let word of words) {
            let type;
            if (labelRe.test(word)) {
                type = 'label';
            } else if (directiveRe.test(word)) {
                type = 'directive';
            } else if (isInstruction(word)) {
                type = 'instruction';
            } else if (numericalConstantRe.test(word)) {
                type = 'number';
            }
            if (!type) {
                throw {
                    name: 'Scanner error',
                    message: 'Invalid token ' + word
                };
            }
            yield {
                value: word,
                type
            };
        }
    }
};

module.exports = { scan };
