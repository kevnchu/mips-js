// parser produces an object with two properties:
// data and text.
//
// data contains all variable definitions
// text contains all instructions
parse = function (tokenGen) {
    for (const token of tokenGen) {
        switch token.type {
            case 'directive':
                break;
            case 'label':
                break;
            case 'definition':
                h
            case 'instrution':
                break;
        }
    }
};

module.exports = { parse };
