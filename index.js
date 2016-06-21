const fs = require('fs')
const assembler = require('./src/assembler')
const Cpu = require('./src/cpu')

fs.readFile('./examples/add.asm', 'utf8', (err, data) => {
  // fs.readFile('./examples/simple.asm', 'utf8', (err, data) => {
  if (err) {
    // errback
    console.log(err)
    process.exit(-1)
  }
  const program = assembler.compile(data)
  const emu = new Cpu()
  emu.loadProgram(program)
  emu.loop()
})

