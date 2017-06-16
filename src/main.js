import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import Assembler from './assembler'
import Cpu from './cpu'
import RegistersView from './ui/registers.jsx'
import InstructionView from './ui/instructions.jsx'
import ExecutionView from './ui/execution.jsx'

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

class Mips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      programText: ''
    }
    this.assembler = new Assembler()
    this.cpu = new Cpu()
    this.state.instructionList = []

    this.handleLoadProgram = this.handleLoadProgram.bind(this)
  }

  handleLoadProgram (programText) {
    const assembler = this.assembler
    const cpu = this.cpu
    let instructionList

    try {
      instructionList = assembler.compile(programText)
      cpu.loadProgram(instructionList)
      this.setState({
        programText,
        instructionList
      })
    } catch (e) {
      console.warn('Compilation error')
    }
  }

  render () {
    return (
      <div className='flex-container'>
        <RegistersView registers={this.cpu.registers} />
        <InstructionView instructions={this.state.instructionList} />
        <ExecutionView programText={data} onLoadProgram={this.handleLoadProgram} />
      </div>
    )
  }
}

ReactDOM.render(<Mips />, document.getElementById('root'))
