import React, { Component, createRef } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import striptags from "striptags";
import Truncate from "react-truncate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropzoneComponent from 'react-dropzone-component';

import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

// import "regenerator-runtime/runtime.js";
import { addNewArticle, updateArticle } from '../../../api/firestoreApi';
import { CheckAuthStatus } from '../../../api/firebaseApi';

export default class AddMetaData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: this.props.content,
            other_meta_key: "",
            other_meta_value: "",
            name: "",
            author: "",
            other_meta_data: [],
            coverImg: "",
            coverImgFile: "",
        }
        
        this.addNewFormElement = this.addNewFormElement.bind(this);
        this.removeFormElement = this.removeFormElement.bind(this);
        this.updateState = this.updateState.bind(this);
        this.onMetaChange = this.onMetaChange.bind(this);
        this.getValue = this.getValue.bind(this);

        this.componentConfig = this.componentConfig.bind(this);
        this.djsConfig = this.djsConfig.bind(this);

        this.onImgAdded = this.onImgAdded.bind(this);
        this.removeImage = this.removeImage.bind(this);

        this.coverImgRef = createRef();

        this.wait = this.wait.bind(this);
        this.onSavePressed = this.onSavePressed.bind(this);

    }


   async onSavePressed() {
        // console.log(`BEFORE SAVE, CHECK USER STATUS..... ${await CheckAuthStatus(this.props)}`, )
        let getuser = localStorage.getItem("user");
        let userstatus = localStorage.getItem("user_logged_in");
        let _user = JSON.parse(getuser);
        console.log("ON SAVE POST..... GET USER -> ", getuser);
        console.log("ON SAVE POST..... GET USER STATUS -> ", userstatus);

        let meta_data = {
            name: this.state.name,
            author: this.state.author,
        }
        this.state.other_meta_data.forEach(metaObj => {
            let newObj = {
                [metaObj.key]: metaObj.value,
            }

            Object.assign(meta_data, newObj);

        })
        let article_content = this.state.content;
        let cover_image = `${(this.state.coverImgFile.dataURL)}`;

        let saveObj = {
            article_content: article_content,
            article_meta_data: meta_data,
            cover_image: cover_image,
            user_id: _user.user_id,
            
        }
        if(userstatus !== "true"){
            alert("You are not logged in. Please login to save a post")
        }
        if(userstatus === "true"){
            alert("POST SAVED!")
            this.props.onModalClose()
        }

        let edit_mode = this.props.edit_mode;
        if(edit_mode){
            let getItem = localStorage.getItem('read-obj');
            let item = JSON.parse(getItem);
            saveObj.id = item.id;
            console.log("UPDATE ARTICLE ------> ",updateArticle(saveObj))
            this.props.props.history.push('/library')
        }else{
            console.log("ADD NEW ARTICLE ------> ",addNewArticle(saveObj))
        }
        console.log("SAVE THIS OBJ ---> ", saveObj);

    }

    removeImage() {
        this.setState({ 
            coverImg: "",
            coverImgFile: "",
        })
    }

    onImgAdded() {
        return {
            addedfile: file => {
                this.setState({ 
                    coverImg: file.dataURL,
                    coverImgFile: file,
                })
                // console.log("IMAGE FILE ADDED --> ", file)
            }
        }
    }

    componentConfig() {
        return {
            iconFileTypes: [".jpg", ".png"],
            showFiletypeIcon: true,
            postUrl: "https://httpbin.org/post"
        }
    }

    djsConfig() {
        return {
            addRemoveLinks: true,
            maxFiles: 1
        }
    }


    getValue(for_key) {
        for (const [key, value] of Object.entries(this.state)) {
            // console.log("KEY --> ", key, " Value -------> ", value)
            if(key === for_key){
                console.log("VALUE FOR KEY --> ", for_key, " -------> ", value)
        return value
            }

        }

    }

    
    onMetaChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    wait(timeout) {
          return new Promise (resolve => {
            setTimeout(resolve, timeout);
          })
        }

    removeFormElement(removeKey) {
        let keyIndex = Object.keys(this.state).indexOf(removeKey)
        console.log("REMOVE KEY INDEX --> ", keyIndex);     
        
        let thisState = Object.entries(this.state)
        let newStateArray = thisState.splice(keyIndex, 1)
        let metaObj = {
            key: newStateArray[0][0],
            value: newStateArray[0][1],
        }
        console.log("META DATA OBJ", metaObj)
        
        function findMetaData(mObj) {
            let mObj_key = mObj.key
            return mObj_key !== removeKey
        }
        let meta_data_filtered = this.state.other_meta_data.filter(findMetaData);

        let metaIndex = Object.keys(Object.fromEntries(thisState)).indexOf("other_meta_data")
        let removeMetaState = thisState.splice(metaIndex, 1)
        console.log("DEX OF META DATA ===> ", metaIndex);
        console.log("REMOVE META ---> ", removeMetaState);
        this.setState({
            other_meta_data: meta_data_filtered
        })

        // console.log("OTHER META DATA FILTERED??", meta_data_filtered)

        // console.log("REMOVED FROM STATE ARRAY ---> ", newStateArray);
        // console.log("NEW STATE ARRAY?? ---> ", thisState);

        this.wait(3000).then( () => {
            this.updateState(thisState, meta_data_filtered)
        })


    }

    updateState(stateEntries, meta_data_filtered) {
        console.log("UPDATING STATE............. ", stateEntries)
        let newState = Object.fromEntries(stateEntries);
        newState.other_meta_data = meta_data_filtered
        this.state = newState
        // this.setState((state) => {
        //     return state = newState
        // })
        this.setState(newState)
        console.log("NEW STATE OBJ ?? ---> ", newState);
        this.setState({
            other_meta_data: meta_data_filtered
        })
        console.log("THIS STATE OBJ ?? ---> ", this.state);
    }

    addNewFormElement(){
        let key = this.state.other_meta_key;
        let val = this.state.other_meta_value;
        console.log("META OB LIST ---> ", this.state.other_meta_data)
        if(val !== "" && key !== ""){
            function findKey(stateKey){
                return stateKey.key === key
            }
            let checkKeys = this.state.other_meta_data.find(findKey)
            console.log("CHECK KEYS ---> ", checkKeys);
            if(checkKeys === undefined || checkKeys === null || checkKeys === -1){
                let other_meta_data = this.state.other_meta_data;

                let obj = {"key": key, "value": val}
                this.setState({
                    [key]: val
                })
                console.log("ADD NEW FORM ELEMENT : ---> ", obj);
                other_meta_data.push(obj)
                this.setState({other_meta_data})
                this.setState({
                    other_meta_key: "",
                    other_meta_value: ""
                })
                console.log("NEW FORM ELEMENT ADDED TO META: ---> ", obj);
            }else{
                this.setState({
                    other_meta_key: "",
                    other_meta_value: ""
                })
                alert(`'${key}' has already been added. Add another key.`)
            }
        }else{
            alert("Please add Key and Value");
        }        
    }


    componentDidMount() {
        let edit_mode = this.props.edit_mode;
        console.log("IS EDIT MODE ----> ", edit_mode)
        if(edit_mode){
            let getItem = localStorage.getItem('read-obj');
            let item = JSON.parse(getItem);
            let meta_data = item.article_meta_data;
            let name = meta_data.name;
            let author = meta_data.author;
            let coverImg = item.cover_image

            this.setState({name})
            this.setState({author})
            this.setState({coverImg})


            let objList = Object.entries(meta_data)
            let newObj = [];
            objList.forEach(metaItm => {
                const [key, value] = metaItm
                console.log("META ITEM ---> ", key, " - ", value);
                if(key !== "name" && key !== "author"){
                    let addObj = {'key':key, 'value':value}
                    newObj.push(addObj)
                    this.setState({
                        [key]: value
                    })
                }
            })
            console.log("NEW OBJ? ", newObj)
            this.setState({other_meta_data:newObj})
        }

    }


  render() {
    return (
      <div>
        <div className='title-header-wrapper'>
            Save Article
        </div>
        <div className='article-form-wrapper'>
            <div className='save-article-content-wrapper'>
                <div>{striptags(this.state.content)}</div>            
            </div>
            <div className='meta-form-container'>
                <div className='form-element'>
                    <label htmlFor="name">Name: </label>
                    <input 
                    type={"text"}
                    name={"name"}
                    placeholder={"Article Name"}
                    value={this.state.name}
                    onChange={this.onMetaChange}
                    />
                    <FontAwesomeIcon icon="fa-lock"  id='lock_icon' onClick={()=> {console.log("CANNOT REMOVE --> Name")}}/>
                </div>
                <div className='form-element'>
                    <label htmlFor="author">Author: </label>
                    <input 
                    type={"text"}
                    name={"author"}
                    placeholder={"Author"}
                    value={this.state.author}
                    onChange={this.onMetaChange}
                    />
                    <FontAwesomeIcon icon="fa-lock"  id='lock_icon' onClick={()=> {console.log("CANNOT REMOVE --> Author")}}/>
                </div>

                {this.state.other_meta_data.map(form_data => {
                    let key = form_data.key;
                    let val = form_data.value;
                    return (
                        <div className='form-element' key={this.state.other_meta_data.indexOf(form_data)}>
                            <label htmlFor={`${key}`}>{key}: </label>
                            <input 
                            type={"text"}
                            name={`${key}`}
                            placeholder={`${key}`}
                            value={this.state[key]}
                            onChange={this.onMetaChange}
                            />
                            <FontAwesomeIcon icon="fa-trash-can"  id='delete_icon' onClick={()=> {this.removeFormElement(key)}}/>
                        </div>
                    )
                })}                    

            </div>
        </div>

        <div className='add-form-btn-wrapper'>
                <div className='add-form-save-btn'>
                    <button type='submit' onClick={this.onSavePressed}>SAVE</button>
                </div>
            </div>

        <div className='form-element-wrapper'>
            <div className='add-form-element-wrapper'>
                <div className='add-form-element-title'>
                    Add more information about the article
                </div>
                <div className='add-form-element'>
                    <input 
                    type={"text"}
                    name={"other_meta_key"}
                    placeholder={"key - eg: Author #2"}
                    value={this.state.other_meta_key}
                    onChange={this.onMetaChange}
                    />
                </div>
                <div className='add-form-element'>
                    <input 
                    type={"text"}
                    name={"other_meta_value"}
                    placeholder={"Value - eg: Brown James"}
                    value={this.state.other_meta_value}
                    onChange={this.onMetaChange}
                    />
                </div>
                <div className='add-form-element-btn'>
                    <button type='submit' onClick={this.addNewFormElement}>Add</button>
                </div>
            </div>
                {this.state.coverImg? 
                    <div className='cover-image-wrapper'>
                    <img src={this.state.coverImg}/> 
                    <div className='image-removal-link'>
                        <a 
                            onClick={()=> this.removeImage()}
                            >
                            Remove Image
                        </a>
                    </div>
                    </div>
                    :
                <div className='drop-zone-wrapper'>
                    <DropzoneComponent
                        ref={this.coverImgRef}
                        config={this.componentConfig()}
                        djsConfig={this.djsConfig()}
                        eventHandlers={this.onImgAdded()}
                    >
                        <div className='dz-message'>Upload Cover Image</div> 
                    </DropzoneComponent>
                </div>
                }
            
        </div>
        

        
    </div>
    )
  }
}
