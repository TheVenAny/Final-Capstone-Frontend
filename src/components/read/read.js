import React, { Component } from 'react';
import striptags from "striptags";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FontSize from './settings/font-size';
import Color from './settings/color';
import FontFamily from './settings/font-family';



export default class Read extends Component {
  constructor(props){
    super(props)

    this.state = {
      font_size: 19,
      color: "black",
      font_selected: "System Default",
      use_font_selected: "",
      dropdwnOpen: false,
      play_icon: "fa-play",
      play_icon_class: "play_pause_icon-wrapper",
      wordIndex: 0,
      newLoad: false,

    }

    this.onSettingsIconClicked = this.onSettingsIconClicked.bind(this);
    this.onFontSizeChange = this.onFontSizeChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onDropDwnClicked = this.onDropDwnClicked.bind(this);
    this.closeDropDwn = this.closeDropDwn.bind(this);
    this.onDropDwnItemClicked = this.onDropDwnItemClicked.bind(this);
    this.onPlayPressed = this.onPlayPressed.bind(this);

    this.wait = this.wait.bind(this);
    this.onBoundry = this.onBoundry.bind(this);


  }
 
  

  wait(timeout) {
        return new Promise (resolve => {
          setTimeout(resolve, timeout);
        })
      }

  onBoundry(e) {
    let wordIndex = this.state.wordIndex;
    // console.log("ON BOUNDRY EVENT --> ", e);
    let textElement = document.getElementById('read_content_wrapper')
    let readText = textElement.innerHTML.toString()
    let charIndex = e.charIndex;
    let charLength = e.charLength;
    let charEnd = charIndex+charLength
    let fulltext = `${e.utterance.text}`
    let atText = fulltext.charAt(e.charIndex);

    let atWord = fulltext.substring(charIndex,charIndex+charLength)

    let textPt1 = fulltext.substring(0,charIndex)
    let textPt2 = `<mark>${atWord}</mark>`
    let textPt3 = fulltext.substring(charEnd+1, readText.length)

    let newText = `${textPt1}${textPt2} ${textPt3}`;
    document.getElementById('read_content_wrapper').innerHTML = newText


    // console.log("ON BOUNDRY EVENT CHAR INDEX --> ", charIndex);
    // console.log("ON BOUNDRY EVENT  CHAR LEN --> ", charLength);
    // console.log("ON BOUNDRY EVENT  CHAR END --> ", charEnd);
    // console.log("ON BOUNDRY EVENT  TEXT --> ", atText);
    // console.log("ON BOUNDRY EVENT  WORD --> ", atWord);

    let useText = readText
    // /[.,?!:;=]/
let current_word = useText.split(" ")[wordIndex]
// if(
//   current_word.endsWith(".")
//   ||current_word.endsWith("?")
//   ||current_word.endsWith("!")
//   ||current_word.endsWith(";")
//   ||current_word.endsWith(":")){ 
//   this.wait(1000).then(() => {
//       console.log(" Word? ----> ", current_word)
//       // console.log(" Words? ----> ", useText)
//       this.setState({
//         wordIndex: wordIndex+1
//       })
//   })
// }else{
//   this.wait(50).then(() => {
//       console.log(" Word? ----> ", current_word)
//       // console.log(" Words? ----> ", useText)
//       this.setState({
//         wordIndex: wordIndex+1
//       })
//   })
// }
  }

  onPlayPressed() {
    let textElement = document.getElementById('read_content_wrapper')
    let readText = textElement.innerHTML
    let speech = new SpeechSynthesisUtterance(`${readText}`)
    speech.lang = "en-US";
    speech.volume = '3'
    speech.rate = '0.7'
    speech.addEventListener('boundary', this.onBoundry)
    speech.addEventListener('end', () => {
      speechSynthesis.cancel();
      console.log("NOT SPEAKING.......STOPPED?")
      this.setState({
        play_icon:"fa-play",
        play_icon_class: "play_pause_icon-wrapper"
      })
   if( document.getElementById('read_content_wrapper').innerHTML !== undefined){
    document.getElementById('read_content_wrapper').innerHTML = striptags(this.props.content);
   }

    })
    
    if(this.state.play_icon === "fa-play"){
      if(speechSynthesis.paused){
        if(this.state.newLoad === true){
          this.setState({newLoad:false})
          speechSynthesis.speak(speech)
          console.log("START SPEAKING.......NEW SPEECH")
        }else{
          speechSynthesis.resume(speech)
          console.log("RESUME SPEAKING.......")
        }
      }else{
        speechSynthesis.speak(speech)
        console.log("START SPEAKING.......NEW SPEECH")
      }
      // speech.pause()
      this.setState({
        play_icon:"fa-pause",
        play_icon_class: " pause_play_icon-wrapper"
      })
    }else{
      speechSynthesis.pause()
      console.log("NOT SPEAKING.......PAUSED")
      this.setState({
        play_icon:"fa-play",
        play_icon_class: "play_pause_icon-wrapper"
      })
    }

  }

  onDropDwnItemClicked(e) {
    e.preventDefault()
    let val = e.target.innerHTML;
    console.log("DROP DOWN ITEM SELECTED ---> ", val);
    this.setState({
      font_selected:val,
      use_font_selected:val
    })
    if(val === "System Default"){
      this.setState({
        font_selected:val,
        use_font_selected:""
      })
    }

  }

  closeDropDwn(event) {
    if(!event.target.matches('.drop-dwn-btn', '.dropdwn-settings-icon')) {
    // event.preventDefault()
      let drop_dwn_element = document.getElementsByClassName("drop-dwn-list")
      let i;
      for (i = 0; i < drop_dwn_element.length; i++) {
        let dropdwn_open = drop_dwn_element[i];
        if(dropdwn_open.classList.contains("showBlock")) {
          dropdwn_open.classList.remove("showBlock");
          this.setState({dropdwnOpen:!this.state.dropdwnOpen})
          console.log("DROPDOWN OPEN ??? ---> ", !this.state.dropdwnOpen)
        }
      }
    }
  }

  onDropDwnClicked() {
    console.log("DROP DWN CLICKED!!! ")
    let dropdwnList = window.document.getElementById('drop_dwn_list')
    dropdwnList.classList.toggle("showBlock");
    // console.log("DROP DOWN LIST ? ------> ", dropdwnList)
    console.log("DROPDOWN OPEN ??? ---> ", !this.state.dropdwnOpen)
    this.setState({dropdwnOpen:!this.state.dropdwnOpen})
  }

  onColorChange(e){
    let color = e.target.value;
    console.log("COLOR CHANGE ---> ", color);
    this.setState({color});
  }

  onFontSizeChange(e){
    let font_size = e.target.value;
    // console.log("NEW FONT SIZE ---> ", font_size);
    this.setState({font_size})
  }


  onSettingsIconClicked() {
    console.log("SETTINGS ICON CLICKED!!! ")
    let dropdwnList = window.document.getElementById('read_settings_wrapper')
    dropdwnList.classList.toggle("show-settings-wrapper");

  }


  componentDidUpdate() {
    window.addEventListener("click", this.closeDropDwn, true);

    // SpeechSynthesisUtterance.addEventListener("boundry", this.onBoundry)
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.closeDropDwn, true);
    speechSynthesis.cancel()

    let textElement = document.getElementById('read_content_wrapper')
    let readText = textElement.innerHTML
    let speech = new SpeechSynthesisUtterance(`${readText}`)
    speech.removeEventListener('boundary', this.onBoundry, true)
  }

  componentDidMount(){
    this.setState({
      newLoad: true
    })
    console.log("COMPONENT DID MOUNT ! --------> ")
  }



  render() {
    return (
      <div className='read-container'>
        
        <div 
          className='read-content-wrapper'
          id="read_content_wrapper"
          style={{
            fontSize: `${this.state.font_size}px`,
            color: `${this.state.color}`,
            fontFamily: `${this.state.use_font_selected}`,
          }}
          >
          {striptags(this.props.content)}
        </div>
          
        <div className='read-icons-wrapper'>
          <div className={this.state.play_icon_class} 
            onClick={this.onPlayPressed}>
              <FontAwesomeIcon icon={this.state.play_icon}  id='play_pause_icon' />
          </div>  
          <div className='read-settings_icon-wrapper' onClick={this.onSettingsIconClicked}>
              <FontAwesomeIcon icon="fa-gears"  id='read_settings_icon' />
          </div>   
        </div>  

        <div id='read_settings_wrapper' className='read-settings-wrapper'>
          <div className='read-settings'>
            <FontSize 
              onFontSizeChange={this.onFontSizeChange}
              font_size={this.state.font_size}
              />
              <FontFamily
                fontFam={fontFam}
                font_selected={this.state.font_selected}
                onDropDwnClicked={this.onDropDwnClicked}
                dropdwnOpen={this.state.dropdwnOpen}
                onDropDwnItemClicked={this.onDropDwnItemClicked}
              />
              <Color 
                onColorChange={this.onColorChange}
              />
            </div>
        </div>

      </div>
    )
  }
}


const fontFam = [
`'Abel', sans-serif`,
`'Architects Daughter', cursive`,
`'Caveat', cursive`,
`'Chakra Petch', sans-serif`,
`'Cormorant Infant', serif`,
`'Grandstander', cursive`,
`'Handlee', cursive`,
`'Lato', sans-serif`,
`'Libre Franklin', sans-serif`,
`'Mukta', sans-serif`,
`'Oregano', cursive`,
`'PT Sans Narrow', sans-serif`,
`'Rajdhani', sans-serif`,
`'Rubik Vinyl', cursive`,
`'Stint Ultra Condensed', cursive`,
`System Default`
]