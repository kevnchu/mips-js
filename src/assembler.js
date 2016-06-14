// converts MIPS instructions into machine instructions / data
const fs = require('fs')
const parser = require('./parser')
const instructions = require('./instructions')
const { registersIndices } = require('./registers')

// const textSp = 0x00400000
// const dataSp = 0x10010000

const translateArgs = (args) => {
  if (!args) {
    return args
  }
  return args.map((arg) => {
    if (arg.type === 'register') {
      // resolve register / memory addressing
      let reg = registersIndices[arg.value]
      if (reg) {
        return reg
      }
    }
    return arg.value
  })
}

const translateInstruction = (instruction) => {
  const args = translateArgs(instruction.args)
  const mneumonic = instruction.value.toUpperCase()
  console.log(instructions[mneumonic].apply(null, args))
}

const run = function (program) {
  const { text, data } = parser.parse(program)
  for (let line of data) {
    console.log(line)
  }
  let instructionTable = {
    _default: []
  }
  let instructions = instructionTable._default
  for (let line of text) {
    if (line.type === 'label') {
      instructions = instructionTable[line.value] = []
    } else {
      instructions.push(translateInstruction(line))
    }
  }
}

if (require.main === module) {
  fs.readFile('./examples/simple.asm', 'utf8', (err, data) => {
    if (err) {
      // errback
      console.log(err)
      process.exit(-1)
    }
    run(data)
  })
}
