const fs = require('fs')
const Assembler = require('./src/assembler')

fs.readFile('./examples/add.asm', 'utf8', (err, data) => {
  if (err) {
    // errback
    console.log(err)
    process.exit(-1)
  }
  const assembler = new Assembler()
  assembler.compile(data)

  console.log(assembler.instructionTable)
  // const program = assembler.compile(data)
  // const emu = new Cpu()
  // emu.loadProgram(program)
  // emu.loop()
})
