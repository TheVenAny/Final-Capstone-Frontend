import React from 'react'

export default function Color(props) {
  return (    
    <div className='settings-wrapper'>
        <div className='settings-label-wrapper'>
            Color
        </div>
        <div className='settings-item-wrapper'>
            <input 
            type={'color'}
            className={"color-picker"}
            onChange={props.onColorChange}
            />
        </div>
    </div>
  )
}