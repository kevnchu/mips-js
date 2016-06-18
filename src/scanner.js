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
const Token = require('./token')
const util = require('./util')

const isInstruction = (str) => {
  return instructions.hasOwnProperty(str.toUpperCase())
}

// token classes
// const label = /^[A-z_][A-z0-9]*\s*:\s*$/
// const directive = /^\.[A-z]+/
// const numericalConstant = /^(\d+|0x[0-9a-f]+)$/i
// const string = /^".*"$/
// const register = /^\$/
// const identifier = /^[0-9A-z]+$/
// const address = /[0-9]*\([\$0-9A-z]+\)$/

// regexps
const alpha = /[A-z]/
const numeric = /[-0-9]/
const hexNumeric = /[-xX0-9A-Fa-f]/
const alphaNumeric = /[A-z0-9]/
const whitespace = /\s/

class SyntaxError extends Error {
  constructor (message) {
    super()
    this.name = 'Syntax error'
    this.message = message
  }
}

class Tokenizer {
  constructor (program) {
    const {getNext} = util.generatorAdapter(program)
    this.getChar = getNext
  }

  scanWhile (regex) {
    let curr = this.curr
    let lexeme = ''
    do {
      lexeme += curr
      curr = this.getChar()
    } while (curr && regex.test(curr))
    this.curr = curr
    return lexeme
  }

  getEolToken () {
    const token = new Token('eol', this.curr)
    this.curr = this.getChar()
    return token
  }

  getIntToken () {
    const type = 'int'
    let value = this.scanWhile(hexNumeric)
    try {
      value = parseInt(value)
    } catch (e) {
      throw new SyntaxError('Illegal token')
    }
    return new Token(type, value)
  }

  getStringToken () {
    const type = 'string'
    let value = ''
    let curr = this.curr
    do {
      value += curr
      curr = this.getChar()
    } while (curr && curr !== '"')
    value += curr
    this.curr = this.getChar()
    return new Token(type, value)
  }

  getIdentifierToken () {
    let type = 'identifier'
    const value = this.scanWhile(alphaNumeric)
    if (isInstruction(value)) {
      type = 'instruction'
    }
    return new Token(type, value)
  }

  getDirectiveToken () {
    const type = 'directive'
    let value = this.scanWhile(alphaNumeric)
    return new Token(type, value)
  }

  getRegisterToken () {
    const type = 'register'
    let value = this.scanWhile(alphaNumeric)
    return new Token(type, value)
  }

  skipComment () {
    let curr = this.curr
    while (curr && curr !== '\n') {
      curr = this.getChar()
    }
    this.curr = curr
  }

  getCharToken () {
    const type = 'ascii'
    const value = this.curr
    this.curr = this.getChar()
    return new Token(type, value)
  }

  tokenize () {
    const self = this
    return (function * () {
      self.curr = self.getChar()
      while (self.curr) {
        let curr = self.curr
        let token
        if (curr === '\n') {
          token = self.getEolToken()
        } else if (whitespace.test(curr)) {
          // ignore whitespace
          self.scanWhile(whitespace)
          continue
        } else if (alpha.test(curr)) {
          token = self.getIdentifierToken()
        } else if (numeric.test(curr)) {
          token = self.getIntToken()
        } else if (curr === '.') {
          token = self.getDirectiveToken()
        } else if (curr === '$') {
          token = self.getRegisterToken()
        } else if (curr === '"') {
          token = self.getStringToken()
        } else if (curr === '#') {
          // ignore comment
          self.skipComment()
          continue
        } else {
          token = self.getCharToken()
        }
        yield token
      }
    }())
  }
}

// generator function returns an iterable that yields tokens
const scan = (program) => {
  return new Tokenizer(program).tokenize()
}

module.exports = { scan }
