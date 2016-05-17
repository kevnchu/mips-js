// token types

// label
let matchLabel = (str) => {
    return /^[A-z0-9]+\s*:\s*$/;
};

// instruction
let matchInstruction = (str) => {
    str = str.trim();
    let words = str.split(/\s+/);
};

let sanitize = (str) => {
    
};

let tokenize = function (program) {
    let lines = program.split('\n');
    let tokens = lines.map((text) => {
        if (matchLabel(text)) {
            return {
                type: 'label',
                value: text
            }
        }
        
    });
};

module.exports = { tokenize };