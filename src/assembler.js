// converts MIPS instructions into machine instructions / data
const fs = require('fs')
const parser = require('./parser')
const instructions = require('./instructions')
const { registerIndices } = require('./registers')

// const textSp = 0x00400000
// const dataSp = 0x10010000

class Assembler {
  // TODO make this less bad
  constructor (program) {
    const { text, data } = parser.parse(program)
    this.instructionTable = {
      _default: []
    }
    this.symbolTable = {}
    let instructionSegment = this.instructionTable._default
    // load data segment first
    for (let line of data) {
      this.symbolTable[line.value] = this.loadData(line)
    }
    for (let line of text) {
      if (line.type === 'label') {
        instructionSegment = this.instructionTable[line.value] = []
      } else {
        instructionSegment.push(this.translateInstruction(line))
      }
    }
  }

  loadData (data) {
    // const type = data.type
    if (!data.data) {
      return data.value
    }
    if (data.data.length > 1) {
      return data.data.map((x) => x.value)
    }
    return data.data[0].value
  }

  translateArgs (args) {
    if (!args) {
      return args
    }
    return args.map((arg) => {
      if (arg.type === 'register') {
        // resolve register / memory addressing
        return registerIndices[arg.value]
      }
      if (arg.type === 'identifier') {
        return this.symbolTable[arg.value]
      }
      return arg.value
    })
  }

  translateInstruction (instruction) {
    const args = this.translateArgs(instruction.args)
    const mneumonic = instruction.value.toUpperCase()
    return instructions[mneumonic].apply(null, args).toString(2)
  }
}

if (require.main === module) {
  fs.readFile('./examples/add.asm', 'utf8', (err, data) => {
    if (err) {
      // errback
      console.log(err)
      process.exit(-1)
    }
    const assembler = new Assembler('li $t1, 12')
    console.log(assembler.instructionTable)
  })
}
