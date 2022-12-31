import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { 
    getAuth, 
    onAuthStateChanged,
} from "firebase/auth";


export default class NavBarApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
        logged_in: false,
        email: "",
    }

    this.storageUpdate = this.storageUpdate.bind(this);
    this.CheckAuthStatus = this.CheckAuthStatus.bind(this);

  }

  storageUpdate() {
    console.log("NAV BAR STORAGE UPDATE ^^^ ^^^ ^^^ ^^^ ")
    let getuser = localStorage.getItem("user");
    let userstatus = localStorage.getItem("user_logged_in");

    console.log("GET USER --> ", getuser);
    console.log("USER STATUS --> ", userstatus);
}

async CheckAuthStatus() {
  const auth = getAuth();
 onAuthStateChanged(auth, async(user) => {
      if (user) {
          const uid = user.uid;
          let userObj = {user_id: uid, user_email:user.email}
          this.setState({
            logged_in: true,
            email: user.email
          })

      } else {
        this.setState({
          logged_in: false,
          email: ""
        })
      }
      })
}


componentDidMount(){
  this.CheckAuthStatus()
  
}
  render() {
    return (
      <div className='nav-bar-container'>
        <div className='nav-bar-left'>
        <div className="nav-link">
          <NavLink exact to="/" activeClassName='nav-link-active'>Home</NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/library" activeClassName='nav-link-active'>Library</NavLink>
        </div>
        </div>
        <div className='nav-bar-right'>
          {this.state.logged_in===false?(
        <div className="nav-link">
          <NavLink to="/auth" activeClassName='nav-link-active'>Sign In</NavLink>
        </div>
        ) 
        :
        (
        <div className="nav-link">
          <NavLink 
          to="logout" 
          activeClassName='nav-link-active'
          onClick={
            () => {
              console.log("LOGOUT CLICKED", this.props.loggedInStatus)
            }
          }
          >
            { `${this.state.email}  Sign Out`}
            </NavLink>
        </div>
        )}
            
        </div>
        
      </div>
    )
  }
}
