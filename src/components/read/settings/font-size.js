import React from 'react'

export default function FontSize(props) {
  return (    
    <div className='settings-wrapper'>
        <div className='settings-label-wrapper'>
            Font Size
        </div>
        <div className='settings-item-wrapper'>
            <input 
            type={'range'}
            min={"8"}
            max={"96"}
            value={props.font_size}
            className={"font-size-slider"}
            onChange={props.onFontSizeChange}
            />
        </div>
    </div>
  )
}
