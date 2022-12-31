import React, { Component } from 'react';

import { 
  getAuth, 
  onAuthStateChanged,
} from "firebase/auth";

import TextAreaApp from '../textArea/app';
import HomeReadBtn from '../buttons/home-read-btn';
import AddArticle from '../forms/add-article';




export default class Home extends Component {
  constructor(props){
    super(props)

    // this.CheckAuthStatus = this.CheckAuthStatus.bind(this)
  }


  componentDidMount() {

  console.log(`"HOME ===== USER PROP -> ", ${this.props.checkLoginStatus}`)
  }

  
  render() {
    return (
      <div className='home-container'>
        <AddArticle/>
        {/* <HomeReadBtn
          checkLoginStatus={this.props.checkLoginStatus}
        /> */}
      </div>
    )
  }
}
