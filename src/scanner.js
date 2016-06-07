// Assembler Syntax

// Program includes .data and .text
// Comments begin with #.  Rest of line is ignored.
// Identifier names are sequence of letters, numbers, underbars (_) and dots (.).
// Labels are declared by putting them at beginning of line followed by colon.  Use labels for variables and code locations.
// Instruction format: op field followed by one or more operands: addi $t0, $t0, 1
// Operands may be literal values or registers.
// Register is hardware primitive, can stored 32-bit value: $s0
// Numbers are base 10 by default.  0x prefix indicates hexadecimal.
// Strings are enclosed in quotes.  May include \n=newline or \t=tab.  Used for prompts.

const instructions = require('./instructions')

const isInstruction = (str) => {
    return instructions.hasOwnProperty(str.toUpperCase());
};

const charIter = (str) => {
    let index = 0;
    const generator = function* () { 
        for (let c of str) {
            ++index;
            yield c;
        }
    };
    
    charGenerator = generator(str);
    
    return {
        getChar: () => charGenerator.next().value,
        peek: () => str[index],
        currentChar: () =>  str[index - 1]
    };
};

// token classes
// const label = /^[A-z_][A-z0-9]*\s*:\s*$/;
// const directive = /^\.[A-z]+/;
// const numericalConstant = /^(\d+|0x[0-9a-f]+)$/i;
// const string = /^".*"$/;
// const register = /^\$/;
// const identifier = /^[0-9A-z]+$/;
// const address = /[0-9]*\([\$0-9A-z]+\)$/;

// regexps
const alpha = /[A-z]/;
const numeric = /[0-9]/;
const alphaNumeric = /[A-z0-9]/;
const whitespace = /\s/;

// generator function returns an iterable that yields tokens
const scan = function* (program) {
    const {currentChar, getChar, peek} = charIter(program);
    let curr = getChar();
    const scanWhile = (regex) => {
        let lexeme = '';
        do {
            lexeme += curr;
            curr = getChar();
        } while (regex.test(curr));
        return lexeme;
    };
    
    while (curr) {
        if (whitespace.test(curr)) {
            curr = getChar();
            continue;
        }
        let type;
        let lexeme = '';
        if (alpha.test(curr)) {
            type = 'identifier';
            lexeme = scanWhile(alphaNumeric);
            if (isInstruction(lexeme)) {
                type = 'instruction';
            }
        } else if (numeric.test(curr)) {
            type = 'int';
            lexeme = scanWhile(numeric);
            lexeme = parseInt(lexeme);
        } else if (curr === '.') {
            type = 'directive';
            lexeme = scanWhile(alphaNumeric);
        } else if (curr === '$') {
            type = 'register';
            lexeme = scanWhile(alphaNumeric);
        } else if (curr === '"') {
            type = 'string';
            do {
                lexeme += curr;
                curr = getChar();
            } while (curr && curr !== '"');
            lexeme += curr;
            curr = getChar();
        } else if (curr === '#') {
            // ignore comment
            while (curr && curr !== '\n') {
                curr = getChar();
            }
            continue;
        } else {
            type = 'ascii';
            lexeme = curr;
            curr = getChar();
        }
        yield {
            value: lexeme,
            type: type
        }
    }
};

module.exports = { scan, charIter };