import React, { Component } from 'react';
import axios from 'axios';

import { userSignin, CheckAuthStatus } from '../../../api/firebaseApi';

const AUTH_TOKEN = "anything"
axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';


export default class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: "",
            password: "",
            errorTxt: "",
            baseUrl: "http://127.0.0.1:5000"
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
        this.handleUnsuccessfulAuth = this.handleUnsuccessfulAuth.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.storageUpdate = this.storageUpdate.bind(this);
    }




handleSuccessfulAuth(message) {
    console.log("TOP MESSAGE --> ")
    this.props.handleSuccessfulLogin();
    console.log("Success MESSAGE --> ", message)
    this.props.history.push('/')
}

handleUnsuccessfulAuth(message) {
    this.props.handleUnsuccessfulLogin()
    console.log("ERROR MESSAGE --> ", message)
}

loginUser(event) {
    fetch( `${this.state.baseUrl}/user/auth` , {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            username: this.state.email,
            password: this.state.password
        })
    })
        .then(response => response.text())
        .then(data => {
            console.log("LOGIN RES ----> ", data);
            let res = data;
            // console.log("RES ----> ", res);
            if(res === "User Verified!"){
                this.handleSuccessfulAuth(res+`\nYou have successfully logged in!`);
    
            }else{
                if(res === "Credentials could not be verified"){
                    this.handleUnsuccessfulAuth(res+ `\nPlease double check your login credentials`);
    
                }else{
                    if(res === "User could not be verified"){
                        this.handleUnsuccessfulAuth(res+ `\nClick Sign Up if you don't have an account.`);
    
                    }
                }
            }
        })
        .catch(error => {
          console.log("CATCH ERROR! loginUser() Error --> ", error)
        })
        event.preventDefault()
    }

handleSubmit(event) {
    event.preventDefault();
    userSignin(this.state.email, this.state.password)
}

// handleSubmit(event) {
//     // console.log("HANDLE SUBMIT ---> ", event)
//     axios({
//         method: "post",
//        url:`${this.state.baseUrl}/user/auth`, 
//        data: {
//                 email: this.state.email,
//                 password: this.state.password
//         },
//         headers: {
//         "Content-type": "application/json",
//         // "Authorization": `Bearer ${AUTH_TOKEN}`

//         },   
//     })
//     .then(response => {
//         console.log("LOGIN RES ----> ", response);
//         let res = response.data;
//         console.log("RES ----> ", res);
//         if(res === "User Verified!"){
//             this.handleSuccessfulAuth(res+`\nYou have successfully logged in!`);

//         }else{
//             if(res === "Credentials could not be verified"){
//                 this.handleUnsuccessfulAuth(res+ `\nPlease double check your login credentials`);

//             }else{
//                 if(res === "User could not be verified"){
//                     this.handleUnsuccessfulAuth(res+ `\nClick Sign Up if you don't have an account.`);

//                 }
//             }
//         }

//     })
//     .catch(error => {
//         this.setState({
//             errorTxt: "An Error Occured While logging in --> " + error.message
//         })
//         console.log("CATCH ERROR -> ", error)
//     });
//     event.preventDefault()
    
// }

handleChange(event) {
    // console.log("Handle Change --> ", event);
    this.setState({
        [event.target.name]: event.target.value,
        errorTxt: ""
    })
}


storageUpdate() {
    console.log("STORAGE UPDATE ^^^ ^^^ ^^^ ^^^ ")
    let getuser = localStorage.getItem("user");
    let userstatus = localStorage.getItem("user_logged_in");

    console.log("GET USER --> ", getuser);
    console.log("USER STATUS --> ", userstatus);
}

componentDidMount(){
    console.log(`STATUS ??? --->  ${CheckAuthStatus(this.props)}`)
    
}


  render() {
    return (
      <div>
      <h1>Login</h1>
      <form 
        onSubmit={this.handleSubmit}
         className="auth-form-wrapper">
          <div className='form-group'>
              {/* <FontAwesomeIcon icon="envelope"/> */}
              <input 
                  type="text" 
                  name='email'
                  placeholder='Email'
                  value={this.state.email}
                  onChange={this.handleChange}
                  />
          </div>
          <div className='form-group'>
              {/* <FontAwesomeIcon icon="lock"/> */}
              <input 
                  type={"password"} 
                  name="password"
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.handleChange}
                  />
          </div>
          <button className='btn' type='submit'>Login</button>
      </form></div>
    )
  }
}
