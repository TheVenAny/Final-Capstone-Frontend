import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import axios from 'axios';

import { 
  getAuth, 
  onAuthStateChanged,
} from "firebase/auth";

import "regenerator-runtime/runtime.js";


import NavBarApp from './navBar/app';
import NavBarMobileApp from './navBar/mobile-app';
import Home from './home/home';
import Login from './auth/login';
import Logout from './auth/logout';
import LibraryApp from './library/library-app';
import EditArticle from './forms/edit-article';

import Icons from './icons/icon';

const AUTH_TOKEN = "anything"
axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      loggedInStatus: "UNAUTHORIZED",
      baseUrl: "http://127.0.0.1:5000",
      // user: null,
      navBar: "",
    }


    Icons();

    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);

    this.statusCheck = this.statusCheck.bind(this);

    this.onScreenResize = this.onScreenResize.bind(this);

  }

  onScreenResize() {
    // console.log("ON SCREEN RESIZE ---> ", e);
    let w_size = window.innerWidth;
    // console.log("WIDTH ---> ", w_size);

      w_size < 750? 
            this.setState({
             navBar: <NavBarMobileApp
                loggedInStatus={this.state.loggedInStatus}
                handleSuccessfulLogout={this.handleSuccessfulLogout}
                checkLoginStatus={this.state.user}                      
              />}
              ) :
           this.setState({
            navBar: <NavBarApp
              loggedInStatus={this.state.loggedInStatus}
              handleSuccessfulLogout={this.handleSuccessfulLogout}
              checkLoginStatus={this.state.user}                      
            />
           })


  }

  handleUnsuccessfulLogin() {
    console.log("HANDLING LOGIN............")
    this.setState({
      loggedInStatus: "UNAUTHORIZED"
    })
  }

  handleSuccessfulLogout() {
    this.setState({
      loggedInStatus: "UNAUTHORIZED"
    })
    console.log("LOGGING OUT -------------->")
  }


  handleSuccessfulLogin() {
    this.setState({
      loggedInStatus: "AUTHORIZED"
    })
  }

async statusCheck() {
  const auth = getAuth();
 const user =  onAuthStateChanged(auth, async(user) => {
        if (user) {
            const uid = user.uid;
            let userObj = {user_id: uid, user_email:user.email}
            this.setState({
              user: userObj
            })
            localStorage.setItem("user", JSON.stringify(userObj));
            localStorage.setItem("user_logged_in", true);
            return userObj

        } else {
          this.setState({
            user: null
          })
          localStorage.setItem("user", null);
          localStorage.setItem("user_logged_in", false);
          return null
        }
      })
      return user
  }


  componentDidUpdate(){
    window.addEventListener('resize', this.onScreenResize, true)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onScreenResize, true)
  }

 async componentDidMount() {
    await this.statusCheck()
    this.onScreenResize()
  }


  render() {
    return (
      <div className='app'>
        <Router>
            <div className='page-container'>
              <Switch>
                <Route
                  exact 
                  path="/" 
                  render={props => (
                    <Home 
                      {...props}
                      checkLoginStatus={this.state.user}
                      />
                  )}
                  />
                <Route path="/library" component={LibraryApp}></Route>
                <Route path="/article/edit" component={EditArticle}></Route>
                
                {this.state.loggedInStatus === "UNAUTHORIZED"
                ?
                (<Route 
                  path="/auth" 
                  render={props => (
                  <Login
                    {...props}
                    handleSuccessfulLogin={this.handleSuccessfulLogin}
                    handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                  />
                  )}
                  />)
                : (null
                    )}
                  <Route 
                    path="/logout" 
                    render={props => (
                    <Logout
                      {...props}
                      handleSuccessfulLogout={this.handleSuccessfulLogout}
                    />
                    )}
                    />
              </Switch>
            </div>
          <div>
            {this.state.navBar
            }
          </div>
        </Router>
      </div>
    );
  }
}
