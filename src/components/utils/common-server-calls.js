import {doc, getDocs, getDoc, collection, query, where} from "@firebase/firestore" 
import { ref, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";

async function set_download_links_by_category(category, setDownloadLinks = null, setVideoNames = null, setNamesAndLinks = null) {
    let video_names = [] , names_and_links = {} ; 
    const videos_collection = collection(firestore, "videos") ; 
    const category_query = query(videos_collection, where("category", "==", category))
    const docs = await getDocs(category_query) ; 
    docs.forEach( (doc) => {video_names.push(doc.id.replace(/_/g, "/"))}) ; 
    const download_urls = await Promise.all( 
        video_names.map( async (name) => {
            let name_ref = ref(storage, name) ; 
            return await getDownloadURL(name_ref) ; 
        })        
     )
    
    video_names.map( (title, index) => {
        names_and_links[title] = download_urls[index] ; 
    })

    if (setDownloadLinks) { setDownloadLinks(download_urls) } ; 
    if (setVideoNames) {setVideoNames(video_names)} ; 
    if (setNamesAndLinks) {setNamesAndLinks(names_and_links)} ; 
}

async function setUserObject(uid, setUser) {
    let user_doc = doc(firestore, "users", uid) ;
    let user_get_doc = await getDoc(user_doc) ;  
    setUser(user_get_doc.data()) ; 
}




export {
    set_download_links_by_category, 
    setUserObject, 
}