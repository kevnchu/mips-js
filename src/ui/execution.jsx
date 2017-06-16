import React from 'react'

export default class ExecutionView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      programText: props.programText
    }

    this.handleProgramChange = this.handleProgramChange.bind(this)
    this.loadProgram = this.loadProgram.bind(this)
    this.step = this.step.bind(this)
  }

  handleProgramChange (e) {
    this.setState({
      programText: e.target.value,
      dirty: true
    })
  }

  loadProgram () {
    // get textarea input and load program
    this.props.onLoadProgram(this.state.programText)
    this.setState({
      dirty: false
    })
  }

  step () {
    // tell CPU to execute next instruction
    console.log('step')
    // this.props.onStep()
  }

  render () {
    return (
      <section className='execution-container'>
        <h2>Assembly</h2>
        <textarea value={this.state.programText}
          onChange={this.handleProgramChange}
          className={this.state.dirty ? 'input-dirty' : null}
        ></textarea>
        <button onClick={this.loadProgram}>Load</button>
        <button onClick={this.step}>Step</button>
      </section>
    )
  }
}
