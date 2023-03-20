import "../../styles/homepage.css"
import PreviewPlayer from "./video-components/preview-player";
import { storage, firestore } from "../../firebase/firebase";
import { getDocs, collection} from "@firebase/firestore" 
import {ref, getDownloadURL} from "firebase/storage" 
import { useEffect, useState } from "react";

function HomePage() {

  const [allURLs, setallURLs] = useState([]) ;  
  const [urlsAndNames, setUrlsAndNames] = useState({}) ;
  
  const load_number_of_videos = 16; 


  const one_time = async () => {
    const temp_names = [] ; 
    const final_names = [] ; 
    const videos = collection(firestore, "videos") ; 
    const docsnap = (await getDocs(videos)).docs ; 
    docsnap.forEach( (data) => {
      temp_names.push(data.id.replace(/_/g, '/'))
    }) 
    
    while (final_names.length < load_number_of_videos){
      let random_number = Math.floor(Math.random() * (temp_names.length - 1)) ; 
      if (!final_names.includes(temp_names[random_number])) 
      {final_names.push(temp_names[random_number])}
    } 

    const get_all_urls = async () => {
      try {
        const results = await Promise.all(
          final_names.map( async (item) => {
            let single_ref = ref(storage, item) ; 
            let url = await getDownloadURL(single_ref) ;   
            return url ; 
          })
        )
        return results ; 
      } catch (error) {
        console.log(error) ; 
      }
    }

    const urls_and_names = {} ; 
    const all_download_urls = await get_all_urls() ;
    final_names.map( (name, index) => {urls_and_names[all_download_urls[index]] = name}) 
    setallURLs(all_download_urls) ; 
    setUrlsAndNames(urls_and_names) ; 
  }

  useEffect( () => {
    one_time() ;  
  }, [])

  return (
    <div className="HomePage Home">
       { allURLs.length >= 2 && Object.keys(urlsAndNames).length >= 2 ? allURLs.map( (url, index) => { 
        return ( <PreviewPlayer 
          className="home-page-player"
          main_container="video-container"
          video_class="video"
          video_information="video-information-main"
          profile_picture="profile-picture-main"
          profile_photo="profile-photo-homepage-player" 
          other_information="other-information-homepage"
          video_title="video-title-homepage"
          video_channel="channel-name-homepage"
          group="group-homepage"
          views="views-homepage"
          date="upload-date-homepage"
          play={false}
          video={url} 
          title={urlsAndNames[url]}
          key={url}
          /> )
       }) : null}
    </div>
    
  );
}

export default HomePage;
