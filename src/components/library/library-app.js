import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {NavLink} from 'react-router-dom';
import { 
    getAuth, 
    onAuthStateChanged,
} from "firebase/auth";
import { 
    collection,
    doc,    
    query, 
    where, 
    getDocs,
 } from "firebase/firestore"; 
 import { getFirestore } from "firebase/firestore";

 import "regenerator-runtime/runtime.js";

 import {app} from '../../../firebase-app'


import ModalDemo from '../modals/modal-demo';
import Read from '../read/read';
import EditArticle from '../forms/edit-article';

import { getArticles } from '../../../api/firestoreApi';
import striptags from "striptags";
 const db = getFirestore(app);

const width = window.innerWidth;
var vwidth = window.innerWidth;


export default class LibraryApp extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      list_view: "list",
      wrapper_class: "",
      search_sel: false,
      // width: width-1,
      fr_str: "",
      snipet_len: 80,
      modalOpen: false,
      modal_content: "",
      loginStatus: false,
      user: null,
      articles: [],
      search_word: "",
    }
    this.onListViewPressed = this.onListViewPressed.bind(this);
    this.onGridViewPressed = this.onGridViewPressed.bind(this);
    this.onSearchIconPressed = this.onSearchIconPressed.bind(this);
    this.sizeUpdate = this.sizeUpdate.bind(this);

    this.onModalClose = this.onModalClose.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onReadPressed = this.onReadPressed.bind(this);


    this.onEditPressed = this.onEditPressed.bind(this);

    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    this.getArticles = this.getArticles.bind(this);

    this.renderList = this.renderList.bind(this);
    this.renderGrid = this.renderGrid.bind(this);

    this.onSearch = this.onSearch.bind(this);
        

  }


  onSearch = async(e) => {
    let search_word = e.target.value;
    this.setState({search_word})
    console.log("- ", search_word);
    let get_use_articles = localStorage.getItem("use_article");
    let use_articles = JSON.parse(get_use_articles);
    

    if(search_word !== ""){
      function filterArticles(artcl) {
        let content = striptags(artcl.article_content).toLowerCase()
        let name = artcl.article_meta_data.name;
        let author = artcl.article_meta_data.author;
        let _search_content = `${content.split(" ").join("")} ${name.split(" ").join("")} ${author.split(" ").join("")}`
        let search_content = _search_content.toLowerCase()
        return search_content.indexOf(search_word.toLowerCase()) !== -1
        // return search_content.includes(search_word.toLowerCase())
      }

      let searchRes = use_articles.filter(filterArticles);
      this.setState({articles:searchRes})
      console.log("SEARCH RES COUNT --> ", searchRes.length)
  }else{
    this.getArticles(this.state.user)
  }



  }

   async getArticles(user){
    let id = user.user_id;
    let articles = await getArticles(id);
    this.setState({articles})
    localStorage.setItem("use_article", JSON.stringify(articles))

  }

  checkLoginStatus() {
    const auth = getAuth();
   onAuthStateChanged(auth, async(user) => {
        if (user) {
            const uid = user.uid;
            let userObj = {user_id: uid, user_email:user.email}
            this.setState({
              loginStatus: true,
              user: userObj
            })
            this.getArticles(userObj);
  
        }else {
          this.setState({
            loginStatus: false,
            user: null
          })
        }
    console.log("IS USER LOGED IN??? --> ", user);
        })
  }


  

  onEditPressed(item) {
    localStorage.setItem('read-content', item.article_content);
    localStorage.setItem('read-obj', JSON.stringify(item));
    // console.log("READ CONTENT SET FOR ITEM ---> ", item);
  }


onReadPressed(item) {
  if(item.article_content){
      this.setState({
          modal_content: <Read content={item.article_content}/>
      })
      this.onModalOpen();
  }else{
      alert("Please add the content you would like to read.")
  }
}

onModalOpen() {
    this.setState({
        modalOpen: true,
    })
}

onModalClose() {
    this.setState({
        modalOpen: false,
    })
}
  
  onListViewPressed() {
    this.setState({
      list_view: "list",
      wrapper_class: "",
    })
  }

    onGridViewPressed() {
      this.setState({
        list_view: "grid",
        wrapper_class: "library_grid_wrapper",
      })
  }

  onSearchIconPressed() {
    this.setState({
      search_sel: !this.state.search_sel
    })
    this.getArticles(this.state.user)
  }

  sizeUpdate = () => {    
    const gridNum = parseInt(window.innerWidth/(234))
    let useGNum = gridNum >= 2? gridNum : 2
    const newRay = new Array(useGNum-1,).fill("1",0)
    if(gridNum-1 >= 4){
      this.setState({
        snipet_len: 80,
      })
    }else{
      if(gridNum-1 === 3){
        this.setState({
          snipet_len: 40,
        })        
      }else{
        if(gridNum-1 === 2){
          this.setState({
            snipet_len: 30,
          })        
        }else{
          if(gridNum-1 < 2){
            this.setState({
              snipet_len: 15,
            })        
          }
        }
      }
    }
    var fr_str = "";
    newRay.forEach(item => {
        fr_str = `1fr ${fr_str}`
    })
    this.setState({fr_str})
  }

  componentDidUpdate() {
    window.addEventListener("resize", this.sizeUpdate, true);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.sizeUpdate, true);
  }

  componentDidMount() {
    this.sizeUpdate()
    this.checkLoginStatus()
  }



  renderList = () => {
    return (     
      this.state.articles.map(item => {
      let cover_image = item.cover_image;
      let content = item.article_content;
      let meta_data = item.article_meta_data;
      let name = meta_data.name?meta_data.name:`No Name - ${this.state.articles.indexOf(item)+1}`;
      let author = meta_data.author?meta_data.author:`No author - ${this.state.articles.indexOf(item)+1}`;
      return(
        <div 
          className='library_list_item_wrapper' key={item.id}
          onClick={()=> {this.onReadPressed(item)}}
          >
            <div>
              <img className='library_list_item_img' src={cover_image}/>
            </div>
            <div> {name}</div>
            <div> {author}</div>
            <div> {striptags(content.substring(0,this.state.snipet_len))}</div>
            <div className='list_view_icons_wrapper'> 
              <div>
                  <FontAwesomeIcon 
                    icon="fa-book-open-reader"  id='list_view_icon' 
                    onClick={() => {this.onReadPressed(item)}}/>
              </div>
              <div>
                <NavLink to="/article/edit" activeClassName='nav-link-active' 
                >
                  <FontAwesomeIcon 
                    icon="fa-i-cursor"  id='list_view_icon' 
                    onClick={() => {
                      this.onEditPressed(item)
                    }}/>
                </NavLink>
              </div>
            </div>
      </div>
      )})
      )
  }



  renderGrid = () =>  {
    return (
    this.state.articles.map(item => {
      let cover_image = item.cover_image;
      let content = item.article_content;
      let meta_data = item.article_meta_data;
      let name = meta_data.name?meta_data.name:`RtiKal ${item.id}`;
      let author = meta_data.author?meta_data.author:`Outhor ${item.id}`;
      return(
        <div 
          className='library_grid_item_wrapper' 
          key={item.id}
          >
          <div className='library_grid_item'>
            <div className='grid_img_wrapper'>
              <img className='library_grid_item_img' src={cover_image}/>
            </div>
            <div className='grid_content_wrapper'>
              <div> Article Name: {name}</div>
              <div> Author: {author}</div>
              <div> Snipet: {striptags(content.substring(0,40))}</div>
            </div>
            <div className='grid_view_icons_wrapper'> 
              <div>
                <FontAwesomeIcon icon="fa-book-open-reader"  id='grid_view_icon' 
                onClick={()=> {
                  this.onReadPressed(item)
                  }}/>
              </div>
              <div>
                <NavLink to="/article/edit" activeClassName='nav-link-active' 
                >
                <FontAwesomeIcon icon="fa-i-cursor"  id='grid_view_icon' 
                onClick={() => {
                  this.onEditPressed(item)
                  }}/>
                  </NavLink>
              </div>
            </div>
          </div>
      </div>
      )})
    )
    
  }





  

  render() {
    const search_ic_styles = this.state.search_sel? {color: "green"}:{}
    const list_ic_styles = this.state.list_view === "list"? {color: "rgba(21, 69, 227, 0.681)"}:{}
    const grid_ic_styles = this.state.list_view !== "list"? {color: "rgba(21, 69, 227, 0.681)"}:{}
    const grid_styles = this.state.wrapper_class===""?
    ({})
    :
   ({
      display: "grid",
      gridTemplateColumns:  this.state.fr_str,
      fontSize: "12px",
      paddingLeft: "1px",
    })
    return (
      <div className='library_container'>
        <div className='list_view_settings_wrapper'>
          {this.state.search_sel === true?
         ( <div className='search_bar_container'>
            <input
              placeholder='Search'
              onChange={this.onSearch}
            />
          </div>):null}
          <div className='view_settings_btn_wrapper'>
            <FontAwesomeIcon 
              icon="fa-magnifying-glass" 
              id={`library_settings_icon`} 
              onClick={this.onSearchIconPressed}
              style={search_ic_styles}
              />
            <FontAwesomeIcon 
              icon="fa-list"  
              id='library_settings_icon' 
              onClick={this.onListViewPressed}
              style={list_ic_styles}
              />
            <FontAwesomeIcon 
              icon="fa-table-cells-large"  
              id='library_settings_icon' 
              onClick={this.onGridViewPressed}
              style={grid_ic_styles}
              />
          </div>
        </div>
        <div 
          className={this.state.wrapper_class}
          style={grid_styles}
        >
          {this.state.loginStatus===true?
          (
            this.state.list_view === "list"?
            (this.renderList()): (this.renderGrid())
          ) :
          (
            <div>
              <h2>{`You are not logged in. \n\n Please login to view your library.`}</h2>
            </div>
          )
          }
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


const ticl = [
  {
  "id": 1,
  "article_meta_data": {'author': 'Won Author'},
  "article_content": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.\n\nCurabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
  "cover_image": "http://dummyimage.com/225x100.png/dddddd/000000"
}, {
  "id": 2,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
  "cover_image": "http://dummyimage.com/155x100.png/5fa2dd/ffffff"
}, {
  "id": 3,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.\n\nIn hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
  "cover_image": "http://dummyimage.com/233x100.png/dddddd/000000"
}, {
  "id": 4,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.\n\nIn congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
  "cover_image": "http://dummyimage.com/181x100.png/ff4444/ffffff"
}, {
  "id": 5,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
  "cover_image": "http://dummyimage.com/145x100.png/dddddd/000000"
}, {
  "id": 6,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.\n\nCurabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
  "cover_image": "http://dummyimage.com/179x100.png/ff4444/ffffff"
}, {
  "id": 7,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
  "cover_image": "http://dummyimage.com/217x100.png/cc0000/ffffff"
}, {
  "id": 8,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
  "cover_image": "http://dummyimage.com/207x100.png/cc0000/ffffff"
}, {
  "id": 9,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.",
  "cover_image": "http://dummyimage.com/163x100.png/ff4444/ffffff"
}, {
  "id": 10,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
  "cover_image": "http://dummyimage.com/213x100.png/ff4444/ffffff"
}, {
  "id": 11,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
  "cover_image": "http://dummyimage.com/144x100.png/cc0000/ffffff"
}, {
  "id": 12,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
  "cover_image": "http://dummyimage.com/105x100.png/dddddd/000000"
}, {
  "id": 13,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
  "cover_image": "http://dummyimage.com/183x100.png/ff4444/ffffff"
}, {
  "id": 14,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.",
  "cover_image": "http://dummyimage.com/104x100.png/5fa2dd/ffffff"
}, {
  "id": 15,
  "article_meta_data": "{'name': 'Article Too'}",
  "article_content": "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
  "cover_image": "http://dummyimage.com/204x100.png/dddddd/000000"
}, {
  "id": 16,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  "cover_image": "http://dummyimage.com/207x100.png/ff4444/ffffff"
}, {
  "id": 17,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
  "cover_image": "http://dummyimage.com/207x100.png/ff4444/ffffff"
}, {
  "id": 18,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
  "cover_image": "http://dummyimage.com/246x100.png/dddddd/000000"
}, {
  "id": 19,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
  "cover_image": "http://dummyimage.com/161x100.png/5fa2dd/ffffff"
}, {
  "id": 20,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
  "cover_image": "http://dummyimage.com/107x100.png/5fa2dd/ffffff"
}, {
  "id": 21,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
  "cover_image": "http://dummyimage.com/176x100.png/5fa2dd/ffffff"
}, {
  "id": 22,
  "article_meta_data": "{'name': 'Article Too'}",
  "article_content": "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.",
  "cover_image": "http://dummyimage.com/204x100.png/5fa2dd/ffffff"
}, {
  "id": 23,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  "cover_image": "http://dummyimage.com/223x100.png/5fa2dd/ffffff"
}, {
  "id": 24,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Fusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
  "cover_image": "http://dummyimage.com/140x100.png/5fa2dd/ffffff"
}, {
  "id": 25,
  "article_meta_data": "{'name': 'Article Too'}",
  "article_content": "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
  "cover_image": "http://dummyimage.com/119x100.png/ff4444/ffffff"
}, {
  "id": 26,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
  "cover_image": "http://dummyimage.com/209x100.png/cc0000/ffffff"
}, {
  "id": 27,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
  "cover_image": "http://dummyimage.com/143x100.png/cc0000/ffffff"
}, {
  "id": 28,
  "article_meta_data": "{'name': 'Article Too'}",
  "article_content": "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.\n\nDuis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
  "cover_image": "http://dummyimage.com/117x100.png/dddddd/000000"
}, {
  "id": 29,
  "article_meta_data": "{'name': 'Article Too'}",
  "article_content": "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
  "cover_image": "http://dummyimage.com/249x100.png/dddddd/000000"
}, {
  "id": 30,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
  "cover_image": "http://dummyimage.com/102x100.png/cc0000/ffffff"
}, {
  "id": 31,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
  "cover_image": "http://dummyimage.com/239x100.png/dddddd/000000"
}, {
  "id": 32,
  "article_meta_data": "{'name': 'Article Too'}",
  "article_content": "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
  "cover_image": "http://dummyimage.com/187x100.png/dddddd/000000"
}, {
  "id": 33,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
  "cover_image": "http://dummyimage.com/239x100.png/dddddd/000000"
}, {
  "id": 34,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
  "cover_image": "http://dummyimage.com/245x100.png/ff4444/ffffff"
}, {
  "id": 35,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
  "cover_image": "http://dummyimage.com/231x100.png/5fa2dd/ffffff"
}, {
  "id": 36,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
  "cover_image": "http://dummyimage.com/183x100.png/cc0000/ffffff"
}, {
  "id": 37,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.\n\nDuis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",
  "cover_image": "http://dummyimage.com/146x100.png/cc0000/ffffff"
}, {
  "id": 38,
  "article_meta_data": "{'author': 'Won Author'}",
  "article_content": "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
  "cover_image": "http://dummyimage.com/114x100.png/ff4444/ffffff"
}, {
  "id": 39,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
  "cover_image": "http://dummyimage.com/248x100.png/ff4444/ffffff"
}, {
  "id": 40,
  "article_meta_data": {'author': 'Tu Author'},
  "article_content": "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.",
  "cover_image": "http://dummyimage.com/231x100.png/cc0000/ffffff"
}, {
  "id": 41,
  "article_meta_data": {'name': 'Article Won'},
  "article_content": "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
  "cover_image": "http://dummyimage.com/148x100.png/ff4444/ffffff"
}
]