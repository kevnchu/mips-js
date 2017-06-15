import React from 'react'
import { registerList } from '../registers'

class Register extends React.Component {
  render () {
    return (
      <div className="register">
        <span className="register-label">
          {this.props.name.toUpperCase()}
        </span>
        <span className="register-value">
          {'0x' + this.props.value.toString(16)}
        </span>
      </div>
    )
  }
}

export default class RegisterView extends React.Component {
  render () {

    const registerItems = Array.prototype.map.call(this.props.registers, (value, index) => {
      return <Register key={index} name={registerList[index]} value={value} />
    })

    return (
      <section className="registers-container">
        <h2>Registers</h2>
        <div className="flex-container">
          {registerItems}
        </div>
      </section>
    )
  }
}
