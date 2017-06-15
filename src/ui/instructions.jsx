import React from 'react'

export default class InstructionView extends React.Component {
  render () {
    const instructionItems = this.props.instructions.map((value, index) => {
      return (
        <div key={index}>
          <span className="instruction-hex">
            {value}
          </span>
          <span className="instruction-text">
          </span>
        </div>
      )
    });

    return (
      <section className="instructions-container">
        <h2>Instructions</h2>
        <div>
          {instructionItems}
        </div>
      </section>
    )
  }
}
