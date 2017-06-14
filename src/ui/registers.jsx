import React from 'react'
import { registerList } from '../registers'

class Register extends React.Component {
  render () {
    return (
      <div>
        :
        {this.props.name.toUpperCase()} = {this.props.value}
      </div>
    )
  }
}

export default class RegisterView extends React.Component {
  render () {
    return (
      <div>
        <h1>Registers</h1>
        <div>
          {this.props.registers.map((value, index) => {
            return <Register name={registerList[index]} value={value} />
          })}
        </div>
      </div>
    )
  }
}
