// parser output:
// data:
// [(label, type, value)]
// text:
// [(instruction, operands)]

const scan = require('./scanner').scan;
const util = require('./util');
const Token = require('./token');

class Parser {

    constructor(input) {
        this.tokenGenerator = scan(input);
        this.getToken = util.generatorAdapter(this.tokenGenerator).getNext;
        this.segment = 'data';
    }

    parse() {
        let program = {
            data: [],
            text: []
        };
        let segment = program.data;
        for (let token of this.tokenGenerator) {
            this.currentToken = token;
            const value = token.value;
            const type = token.type;
            switch (type) {
                case 'directive':
                    if (value === '.data') {
                        this.segment = 'data';
                        segment = program.data;
                    } else if (value === '.text') {
                        this.segment = 'text';
                        segment = program.text;
                    } else {
                        segment.push(this.parseDirective());
                    }
                    break;
                case 'instruction':
                    segment.push(this.parseInstruction());
                    break;
                case 'identifier':
                    // label
                    segment.push(this.parseLabel());
                    break;
                case 'eol':
                    break;
                default:
                    break;
            }
        }
        return program;
    }

    parseDirective() {
    }

    parseInstruction() {
        const instruction = this.currentToken;
        let args = [[]];

        // parse args
        let token = this.getToken();
        let argument = args[0];
        while (1) {
            if (!token || token.type === 'eol') {
                break;
            }
            // each argument is made of one or more tokens.
            // collect tokens for each argument. 
            if (token.value === ',' && argument.length) {
                // push arg
                argument = [];
                args.push(argument);
            } else {
                argument.push(token);
            }
            token = this.getToken();
        }
        // squish arguments
        args = args.map((tokens) => {
            // assumption, argument made of multiple tokens is a register
            if (tokens.length > 1) {
                let value = tokens.map((token) => token.value);
                return new Token('register', value);
            }
            return tokens[0];
        });

        instruction.args = args;
        return instruction;
    }

    parseArguments(arg) {
        if (!arg[0]) {
            return;
        }
        if (arg.length === 1) {
            return arg[0];
        }
        const value = arg.map((token) => {
            return token.value;
        }).join('');
        let type = arg.find((token) => token.type === 'register');
        return new Token(type || arg[0].type, value);
    }

    parseLabel() {
        // if we're in data segment, label is a declaration
        //     label .data-type data...
        //   eg.
        //     value: .byte 1, 2, 3 # store 1, 2, 3 in consecutive
        //                          # bytes of memory.   
        // if we're in text segment, label is a mem address
        // that points to the following instructions.
        // routine:
        //      addi $a0, $t0, $t1
        //      jal  anotherroutine
        // ...
        // return { value: <label name>, }
        const token = this.currentToken;
        this.currentToken = this.getToken();
        return token;
    }

    parseIdentifier() {

    }
}

const parse = (program) => {
    return new Parser(program).parse();
}

module.exports = { parse };
