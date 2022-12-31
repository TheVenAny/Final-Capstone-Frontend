import React, { Component } from 'react';
import { getAuth, signOut } from "firebase/auth";

export default class Logout extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            baseUrl: "http://127.0.0.1:5000",
        }

        this.handleSignOut = this.handleSignOut.bind(this);
    }

  handleSignOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
     this.props.history.push('/auth')
    console.log("USER LOGGED OUT! ")
    }).catch((error) => {
      console.log("An error occured whiile logging out. ERROR: ", error)
    });
  }

  componentDidMount() {
    this.handleSignOut()
  }
    
  render() {
    return (
      <div>Logging Out............ </div>
    )
  }
}
