// converts MIPS instructions into machine instructions / data
const parser = require('./parser')
const instructions = require('./instructions')
const registers = require('./registers')

class Assembler {
  constructor () {
    this.instructionTable = {
      _default: []
    }
    this.symbolTable = {}
  }

  compile (program) {
    const { text, data } = parser.parse(program)

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
        return registers[arg.value]
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
    return instructions[mneumonic].apply(null, args).toString(16)
  }
}

if (require.main === module) {
  const instruction = process.argv[2]
  if (instruction) {
    const assembler = new Assembler()
    assembler.compile(instruction)
    console.log(assembler.instructionTable)
  }
}

module.exports = Assembler
