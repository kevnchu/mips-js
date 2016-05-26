const parseData = function (tokenGen) {
    for (let token of tokenGen) {
	console.log(token);
        // parse
        let value = token.value;
        switch (token.type) {
        case 'directive':
            break;
        case 'label':
            break;
        case 'number':
        case 'instrution':
            break;
        case 'register':
        case 'identifier':
        case 'address':
        default:
            break;
        }
        // eval
    }


};

const parseInstructions = function (tokenGen) {
    for (let token of tokenGen) {
	console.log(token);
        // parse
        let value = token.value;
        switch (token.type) {
        case 'directive':
            break;
        case 'label':
            break;
        case 'number':
        case 'instrution':
            break;
        case 'register':
        case 'identifier':
        case 'address':
        default:
            break;
        }
        // eval
    }

    
};

// parser produces an object with two properties:
// data and text.
//
// data contains all variable definitions
// text contains all instructions
const parse = function (tokenGen) {
    
};

module.exports = { parse };
