const instructions = require('./instructions')

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

const preprocess = function (lines) {
    const dataRe = /^\.data$/;
    const textRe = /^\.text$/;
    const dataIndex = lines.findIndex((x) => dataRe.test(x));
    const textIndex = lines.findIndex((x) => textRe.test(x));
    const cutIndex = Math.max(dataIndex, textIndex);
    const first = lines.slice(0, cutIndex);
    const second = lines.slice(cutIndex);
    return {
        //data: dataIndex === cutIndex ? second : first,
        //text: dataIndex === cutIndex ? first : second
        data: dataIndex,
        text: textIndex
    };
};

const scan = function* (program) {
    // token classes
    const label = /^[A-z_][A-z0-9]*\s*:\s*$/;
    const directive = /^\.[A-z]+/;
    const numericalConstant = /^(\d+|0x[0-9a-f]+)$/i;
    const register = /^\$/;
    const identifier = /^[0-9A-z]+$/;
    const address = /[0-9]*\([\$0-9A-z]+\)$/;

    let lines = program.split('\n').map((str) =>
                                          sanitize(str));
    lines = preprocess(lines);
    // TODO split up scanning by data and instructions
    return;
    for (let text of lines) {
	if (!text) {
	    continue;
	}
        const words = text.split(/[,\s]+/);
        for (let word of words) {
            let type;
            if (label.test(word)) {
                type = 'label';
            } else if (directive.test(word)) {
                type = 'directive';
            } else if (isInstruction(word)) {
                type = 'instruction';
            } else if (numericalConstant.test(word)) {
                type = 'number';
            } else if (register.test(word)) {
		type = 'register';
	    } else if (identifier.test(word)) {
                type = 'identifier';
            } else if (address.test(word)) {
                type = 'address';
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
