import React, {useState} from "react";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";


export const createUser = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        return user
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return errorMessage
        // ..
    });
}


export const userSignin = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // console.log("User Logged In! ---> ", user)
        return user
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return errorMessage
    });
}





export async function CheckAuthStatus(props) {
    const auth = getAuth();
    var status = []
    // var response = "";
   let _check = onAuthStateChanged(auth, async(user) => {
        if (user) {
            const uid = user.uid;
            let userObj = {user_id: uid, user_email:user.email}
            status.push(userObj);
            localStorage.setItem("user", JSON.stringify(userObj));
            localStorage.setItem("user_logged_in", true);
            // console.log("USER AUTHORIZED ----> ", userObj);
            var response =  JSON.stringify(userObj)
            props.history.push('/')
            return response
        } else {
            localStorage.setItem("user", null);
            localStorage.setItem("user_logged_in", false);
            props.history.push('/auth')
            let message = `USER NOT AUTHORIZED ---->  ERROR... YOU ARE NOT LOGGED IN`
            status.push(message)
            var response =  "You are not logged in"
            return response
        }
        // return response
        })
        return _check
}


function statusUpdate(res) {
    // console.log("UPDATED STATUS ---> ", res)
    return res
}


export const statusUpdateCheck = async(props) => {
    let status = CheckAuthStatus()
    return status
}