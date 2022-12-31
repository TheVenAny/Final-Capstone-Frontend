import "regenerator-runtime/runtime.js";
import { 
    collection,
    doc, 
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,   
    query, 
    where, 
    getDocs,
 } from "firebase/firestore"; 
 import { getFirestore } from "firebase/firestore";

 import {app} from '../firebase-app'

 const db = getFirestore(app);


 export const addNewArticle = async(obj) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "articles"), obj)
    obj.id = docRef.id;
    updateArticle(obj);
    return("Document written");
 }


 export const updateArticle = async(obj) => {
    const _Ref = doc(db, "articles", obj.id);

    await updateDoc(_Ref, obj)
    return "Article Updated"
 }


 export const deleteArticle = async(id) => {
    await deleteDoc(doc(db, "articles", id))
    .then(()=> {
        return "Article Deleted"
    }).catch(error => {
        return `Error deleting article. Error: ${error}`
    })
 }

 export const getArticle = async(id) => {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    } else {
    return "Article not found!"
    }
 }


 export const getArticles = async(user_id) => {
    const q = query(collection(db, "articles"), where("user_id", "==", user_id))
    // .then( async()=> {
    // }).catch(error => {
    //     return `Error getting articles. Error: ${error}`
    // })
        const querySnapshot = await getDocs(q);
        let doc_array = [];
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        doc_array.push(doc.data())
        })
        return doc_array

 }