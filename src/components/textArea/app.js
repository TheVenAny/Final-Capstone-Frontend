import React, { Component } from 'react'

export default class TextAreaApp extends Component {
  render() {
    return (
      <div className='text-area-container'>
        <textarea name='text-area' placeholder='Type/Paste Text Here.' id='home_text_area' />
      </div>
    )
  }
}
