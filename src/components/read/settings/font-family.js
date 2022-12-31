import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FontFamily(props) {
  return (    
    <div className='settings-wrapper'>
        <div className='settings-label-wrapper'>
            Font Family
        </div>
        <div className='settings-item-wrapper font-fam-settings'>
            <div className='drop-dwn-btn-wrapper'>
                <button type='reset' className='drop-dwn-btn' onClick={props.onDropDwnClicked}>
                    {props.font_selected.slice(0,17)}{"...."}
                </button>
                <FontAwesomeIcon 
                    icon={props.dropdwnOpen?"fa-chevron-up" :"fa-chevron-down"}  
                    id='dropdwn_settings_icon'
                    className='dropdwn-settings-icon'
                    // onClick={(e)=> {e.preventDefault()}} 
                />
            </div>
            <div id="drop_dwn_list" className='drop-dwn-list'>
                {
                    props.fontFam.map(fontF => {
                        return (
                            <div key={props.fontFam.indexOf(fontF)} className='drop-dwn-item'>
                                <a  
                                    style={{fontFamily:`${fontF}`}}
                                    href={fontF} 
                                    onClick={props.onDropDwnItemClicked}>{fontF}
                                    </a>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}
