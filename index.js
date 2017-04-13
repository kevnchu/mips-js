const fs = require('fs')
const Assembler = require('./src/assembler')
const instructions = require('./src/instructions')
const Cpu = require('./src/cpu')

// setup end to end assemble / execute program
fs.readFile('./examples/add.asm', 'utf8', (err, data) => {
  if (err) {
    // errback
    console.log(err)
    process.exit(-1)
  }
  const assembler = new Assembler()
  const cpu = new Cpu()
  const instructionList = assembler.compile(data)
  // console.log(instructions)
  instructionList.forEach((inst) => {
    console.log('binary', inst)
    console.log(instructions.decode(inst))
  })

  cpu.loadProgram(instructionList)

  // const program = assembler.compile(data)
  // const emu = new Cpu()
  // emu.loadProgram(program)
  // emu.loop()
})
