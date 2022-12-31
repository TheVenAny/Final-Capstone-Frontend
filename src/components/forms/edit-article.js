import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import Wysiwyg from "./wysiwyg";

import ModalDemo from '../modals/modal-demo';
import Read from '../read/read';
import AddMetaData from './add-meta-data';

import { deleteArticle } from '../../../api/firestoreApi';

export default class EditArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            modalOpen: false,
            modal_content: "",
            wysiwyg_class: "",
            editorState: "",
        }

                
        this.setContent = this.setContent.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalOpen = this.onModalOpen.bind(this);
        this.onReadPressed = this.onReadPressed.bind(this);
        this.onSavePressed = this.onSavePressed.bind(this);
        this.onDeletePressed = this.onDeletePressed.bind(this);
        

    }

    onDeletePressed() {
        let getItem = localStorage.getItem('read-obj');
        let item = JSON.parse(getItem);
        let id = item.id

        console.log("DELETE THIS ITEM ---- > ", id)
        console.log("DELETING ITEM ---- > ", deleteArticle(id))
        this.props.history.push('/library');


    }
   
    onSavePressed() {
        if(this.state.content){
            this.setState({
                modal_content: <AddMetaData 
                content={this.state.content}
                onModalClose={this.onModalClose}
                edit_mode={true}
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
        let getContent = localStorage.getItem('read-content')
        if(getContent === undefined || getContent === null) {
            this.props.history.push('/')
        }else{
            this.setState({content: getContent})
        }
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
                        <button onClick={this.onSavePressed} type="submit">Update</button>
                        <button 
                            style={{
                                width: "40%",
                                marginLeft: "10%",
                            }}
                            id='delete_btn'
                         onClick={this.onDeletePressed} type="submit">delete</button>
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

