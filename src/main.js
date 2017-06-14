import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import Assembler from './assembler'
import instructions from './instructions'
import Cpu from './cpu'
import RegistersView from './ui/registers.jsx'

const data = `	.data
value:  .word 15
	.text

main:
    li $t2, 0x19		# Load immediate value (25)
    lw $t3, value	# Load the word stored at label 'value'
    add $t4, $t2, $t3	# Add
    sub $t5, $t2, $t3	# Subtract
    li      $v0, 10              # terminate program run and
    syscall

`

const assembler = new Assembler()
const cpu = new Cpu()
const instructionList = assembler.compile(data)
instructionList.forEach((inst) => {
  console.log('binary', inst)
  console.log(instructions.decode(inst))
})

cpu.loadProgram(instructionList)

ReactDOM.render(<RegistersView registers={cpu.registers} />, document.getElementById('registers-container'))

/*
const fs = require('fs')
const Assembler = require('./assembler')
const instructions = require('./instructions')
const Cpu = require('./cpu')

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
*/
