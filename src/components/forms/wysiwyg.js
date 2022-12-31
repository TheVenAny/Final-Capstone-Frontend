import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';



export default class AddArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
            // editorState: props.loadEditMode? props.loadEditMode :EditorState.createEmpty(),
        }

        this.onEditorStateChange = this.onEditorStateChange.bind(this);

        this.getBase64 = this.getBase64.bind(this);
        this.uploadFile = this.uploadFile.bind(this);

        this.onEditClosed = this.onEditClosed.bind(this);
    }


  onEditClosed() {
    localStorage.removeItem('read-content')
    // console.log("READ CONTENT REMOVED!!!! ---> ", "undefined");
  }

    onEditorStateChange(editorState) {
        // console.log("EDITING??? ", editorState)
        this.setState({editorState}, 
        this.props.setContent(
            draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        )
        )
        
    }

    getBase64(file, callback) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback (reader.result);
        reader.onerror = error => {};

    }

    uploadFile(file) {
        return new Promise((resolve, reject) => {
            this.getBase64(file, data => resolve({ data: {link: data} }) )
        })
    }

    componentDidMount() {
        let getContent = localStorage.getItem('read-content')
        if(getContent !== undefined && getContent !== null) {
            let content = getContent;
            // console.log("EDIT CONTENT FOUND!!! ---> ", content)
            const blocksFromHtml = htmlToDraft(content);
            const { contentBlocks, entityMap} = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);

            this.setState({ editorState })
        }
    }

    componentWillUnmount(){
        this.onEditClosed();
        // console.log("WYSIWYG UNMOUNTED???? ^^^^^^^ ");
    }

  render() {
    return (
      <div>
        <Editor
            editorState={this.state.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName={`demo-editor ${this.props.controlClass}`}
            onEditorStateChange={this.onEditorStateChange}
            // handlePastedText={() => true}
            toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
                image: {
                    uploadCallback: this.uploadFile,
                    alt: { present: true, mandatory: false },
                    previewImage: true,
                    inputAccept: "image/gif,image/jpeg,image/png,image/svg"
                }
            }}
        />
        </div>
    )
  }
}

