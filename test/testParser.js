const assert = require('chai').assert;
const parser = require('../src/parser');

describe('parser.js', () => {
    
    describe('parse', () => {
        it('should parse instructions', () => {
            let str = '.text\naddi $a0, $t1, 4($t2)';
            let { text } = parser.parse(str);
            let args = text[0].args;
            assert.equal(text[0].value, 'addi');
            assert.equal(args.length, 3);

            str = '.text\nj foo';
            ({ text } = parser.parse(str));
            args = text[0].args;
            assert.equal(text[0].value, 'j');
            assert.equal(args.length, 1);
        });

        it('should parse directives', () => {
            let str = '.text\n j foo';
            let { text } = parser.parse(str);
            assert.equal(text[0].value, 'j');

            str = '.data\nfoo: .asciiz "hello world"';
            let { data } = parser.parse(str);
            assert.equal(data[0].value, 'foo');
        });
    });
});

