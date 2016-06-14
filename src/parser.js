// parser output:
// data:
// [(label, type, value)]
// text:
// [(instruction, operands)]

const scan = require('./scanner').scan
const util = require('./util')
const Token = require('./token')

class Parser {

  constructor (input) {
    this.tokenGenerator = scan(input)
    this.getToken = util.generatorAdapter(this.tokenGenerator).getNext
    this.segment = 'data'
  }

  parse () {
    let program = {
      data: [],
      text: []
    }
    let segment = program.data
    for (let token of this.tokenGenerator) {
      this.currentToken = token
      const value = token.value
      const type = token.type
      switch (type) {
        case 'directive':
          // top level directives: data, text, global
          // otherwise, it's a data definition
          if (value === '.data') {
            this.segment = 'data'
            segment = program.data
          } else if (value === '.text') {
            this.segment = 'text'
            segment = program.text
          } else {
            segment.push(this.parseDirective())
          }
          break
        case 'instruction':
          segment.push(this.parseInstruction())
          break
        case 'identifier':
          segment.push(this.parseLabel())
          break
        case 'eol':
        default:
          break
      }
    }
    return program
  }

  parseDirective () {
    // .directive [args]
    const directive = this.currentToken
    let token = this.getToken()
    while (token && token.type !== 'eol') {
      token = this.getToken()
    }
    return directive
  }

  parseInstruction () {
    const instruction = this.currentToken
    let args = [[]]

    // parse args
    let token = this.getToken()
    let argument = args[0]
    while (1) {
      if (!token || token.type === 'eol') {
        break
      }
      // each argument is made of one or more tokens.
      // collect tokens for each argument.
      if (token.value === ',' && argument.length) {
        // push arg
        argument = []
        args.push(argument)
      } else {
        argument.push(token)
      }
      token = this.getToken()
    }
    // squish arguments
    args = args.map((tokens) => {
      if (tokens.length > 1) {
        let value = tokens.map((token) => token.value)
        // XXX assumption, argument made of multiple tokens is a register
        return new Token('register', value)
      }
      return tokens[0]
    })

    instruction.args = args
    return instruction
  }

  // TODO
  parseArguments (arg) {
    if (!arg[0]) {
      return
    }
    if (arg.length === 1) {
      return arg[0]
    }
    const value = arg.map((token) => {
      return token.value
    }).join('')
    let type = arg.find((token) => token.type === 'register')
    return new Token(type || arg[0].type, value)
  }

  parseLabel () {
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
    if (this.segment === 'data') {
      // declaration
      return this.parseDataDeclaration()
    }
    const label = this.currentToken
    let token = this.getToken()
    if (!token || token.value !== ':') {
      throw { // eslint-disable-line no-throw-literal
        name: 'Parse error',
        message: 'Expected a semicolon after label.'
      }
    }
    label.type = 'label'
    return label
  }

  parseDataDeclaration () {
    let token = this.currentToken
    const labelName = token.value
    token = this.getToken() // semicolon
    token = this.getToken() // directive
    if (!token || !token.type === 'directive') {
      throw { // eslint-disable-line no-throw-literal
        name: 'Parse error',
        message: 'Expected a data directive'
      }
    }
    const dataType = token.value
    const data = []
    token = this.getToken()
    while (token && token.type !== 'eol') {
      if (token.value !== ',') {
        data.push(token)
      }
      token = this.getToken()
    }
    return {
      value: labelName,
      type: dataType,
      data: data
    }
  }
}

const parse = (program) => {
  return new Parser(program).parse()
}

module.exports = { parse }
