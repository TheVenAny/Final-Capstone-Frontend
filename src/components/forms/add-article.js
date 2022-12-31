import React, { Component } from 'react';

import { 
    getAuth, 
    onAuthStateChanged,
} from "firebase/auth";


import Wysiwyg from "./wysiwyg";

import ModalDemo from '../modals/modal-demo';
import Read from '../read/read';
import AddMetaData from './add-meta-data';

export default class AddArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            modalOpen: false,
            modal_content: "",
            wysiwyg_class: "",
            logged_in: false,
        }

                
        this.setContent = this.setContent.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalOpen = this.onModalOpen.bind(this);
        this.onReadPressed = this.onReadPressed.bind(this);
        this.onSavePressed = this.onSavePressed.bind(this);
        this.CheckAuthStatus = this.CheckAuthStatus.bind(this);
        

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
  

    

   
    onSavePressed() {
        if(this.state.content){
            this.setState({
                modal_content: 
                <AddMetaData 
                    content={this.state.content}
                    onModalClose={this.onModalClose}
                    edit_mode={false}
                    props={this.props}
                    />
            })
            this.onModalOpen();
        }else{
            alert("Please add the content you would like to save.")
        }
    }

    onReadPressed() {
        if(this.state.content){
            this.setState({
                modal_content: <Read content={this.state.content}/>
            })
            this.onModalOpen();
        }else{
            alert("Please add the content you would like to read.")
        }
    }

    onModalOpen() {
        this.setState({
            wysiwyg_class: "demo-editor-hide",
            modalOpen: true,
        })
    }

    onModalClose() {
        this.setState({
            wysiwyg_class: "",
            modalOpen: false,
        })
    }

    setContent(content) {
        this.setState({content});
    }

    componentDidMount() {
        this.CheckAuthStatus()
    }

    render() {
        return(
            <div>
                <div className='wysiwyg-wrapper'>
                    <Wysiwyg
                        setContent={this.setContent}
                        controlClass={this.state.wysiwyg_class}
                    />
                </div>

                <div className='article-btn-container'>
                    <div className='article-btn'>
                        <button onClick={this.onReadPressed} type="submit">READ</button>
                    </div>

                    <div className='article-btn'>
                        {this.state.logged_in?
                        (<button onClick={this.onSavePressed} type="submit">SAVE</button>) 
                        : null}

                    </div>
                </div>

                <div>
                    <ModalDemo 
                        onModalOpen={this.state.modalOpen}
                        onModalClose={this.onModalClose}
                        ModalContent={this.state.modal_content}
                    />
                </div>
            </div>
        )
    }

}

