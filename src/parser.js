// parser output:
// data:
// [(label, type, value)]
// text:
// [(instruction, operands)]

const scan = require('./scanner').scan
const util = require('./util')

class ParseError extends Error {
  constructor (message) {
    super()
    this.name = 'Parse error'
    this.message = message
  }
}

class Parser {

  constructor (input) {
    this.tokenGenerator = scan(input)
    this.getToken = util.generatorAdapter(this.tokenGenerator).getNext
    this.segment = 'text'
  }

  parse () {
    let program = {
      data: [],
      text: []
    }
    let segment = program[this.segment]
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
          break
        default:
          throw new ParseError('Expected directive, instruction, or label')
      }
    }
    return program
  }

  // TODO
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
    let args = []

    // parse args
    let token = this.getToken()
    while (token && token.type !== 'eol') {
      // ignoring , and ()
      if (token.type !== 'ascii') {
        args.push(token)
      }
      token = this.getToken()
    }

    instruction.args = args
    return instruction
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
      throw new ParseError('Expected a semicolon after label.')
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
      throw new ParseError('Expected a data directive')
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
