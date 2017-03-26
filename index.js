const fs = require('fs')
const Assembler = require('./src/assembler')
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
  const instructions = assembler.compile(data)
  console.log(instructions)
  cpu.loadProgram(instructions)

  // const program = assembler.compile(data)
  // const emu = new Cpu()
  // emu.loadProgram(program)
  // emu.loop()
})
