import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { 
    getAuth, 
    onAuthStateChanged,
} from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class NavBarMobileApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
        logged_in: false,
        email: "",
        show_menu: false,
        menu_btn_styles: {},
        nav_manu_styles: {},
        iconName: "fa-bars",
    }

    this.storageUpdate = this.storageUpdate.bind(this);
    this.CheckAuthStatus = this.CheckAuthStatus.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

  }
  
  toggleMenu() {
    let show_menu = this.state.show_menu;
    this.setState({show_menu:!show_menu})
    console.log("SHOW MENU --> ", !show_menu)

    if(!show_menu === false){
      this.setState({
        menu_btn_styles: {},
        nav_manu_styles: {},
        iconName: "fa-bars",
      })
    }else{
      this.setState({
        menu_btn_styles: {
          justifyContent: "flex-end"
        },
        nav_manu_styles: {
          display: "flex"
        },
        iconName: "fa-xmark",
      })
    }
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
      <div className='nav-bar-mobile-container'>
        <div className='nav-bar-btn-wrapper'>

        <div 
          className="nav-bar-btn"
          style={this.state.menu_btn_styles}
          >
            <FontAwesomeIcon 
                icon={this.state.iconName} 
                id={`mobile-menu_icon`} 
                onClick={this.toggleMenu}
                // style={search_ic_styles}
                />
        </div>
        </div>


        <div 
          className='nav-bar-mobile'
          style={this.state.nav_manu_styles}
          >

          <div className='nav-bar-main-menu'>
            <div className="nav-link">
              <NavLink exact to="/" activeClassName='nav-link-active'>Home</NavLink>
            </div>
            <div className="nav-link">
              <NavLink to="/library" activeClassName='nav-link-active'>Library</NavLink>
            </div>
          </div>

          <div className='nav-bar-accunt-menu'>
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
        
      </div>
    )
  }
}
