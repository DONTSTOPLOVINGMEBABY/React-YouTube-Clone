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

async function set_download_links_by_creator(creator, setDownloadLinks = null, setVideoNames = null, setNamesAndLinks = null) {
    let video_names = [] , names_and_links = {} ; 
    const videos_collection = collection(firestore, "videos") ; 
    const category_query = query(videos_collection, where("creator", "==", creator))
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

async function set_download_links_default_channels(array, setDownloadLinks = null, setVideoNames = null, setNamesAndLinks = null) {
    let video_names = [] , names_and_links = {} ; 
    array.forEach( (doc) => {video_names.push(doc.replace(/_/g, "/"))}) ; 
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

async function set_download_links_by_array(array, setDownloadLinks = null, setVideoNames = null, setNamesAndLinks = null) {
    let video_names = [] , names_and_links = {} ; 
    
    array.forEach( (doc) => {video_names.push(doc.replace(/_/g, "/"))}) ; 
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


const query_with_category_and_search_paramater = async (category, search_paramter, setNamesCallBack, setNamesAndLinkCallback) => {
    let default_videos = [] ; 
    let user_videos = [] ; 
    let videos = [] ; 
    let namesAndLinks = {}

    let videos_collection = collection(firestore, "videos") ; 
    let create_query = query(videos_collection, where(category, "==", search_paramter)) ; 
    let query_result = (await getDocs(create_query)).docs.forEach((doc) => {
        videos.push(doc.id.replace(/_/g, "/")) ; 
    })
    const video_urls = await Promise.all(
        videos.map( async (name) => {
            let name_ref = ref(storage, name) ; 
            return await getDownloadURL(name_ref) ; 
        })
    )

    videos.map( (name, index) => {
        namesAndLinks[name] = video_urls[index] ; 
    })
    
    setNamesAndLinkCallback(namesAndLinks)
    setNamesCallBack(videos) 
}   

const default_channels = [
    "Cinematic Masterpiece", 
    "Dope House", 
    "Everything Planes", 
    "House of Memes", 
    "Meditation Zone", 
    "Meditative Music",
    "Meme Powerhouse", 
    "Tranquil Scenes", 
]


export {
    set_download_links_by_category, 
    set_download_links_by_creator, 
    set_download_links_default_channels, 
    set_download_links_by_array, 
    query_with_category_and_search_paramater, 
    setUserObject, 
    default_channels, 
}