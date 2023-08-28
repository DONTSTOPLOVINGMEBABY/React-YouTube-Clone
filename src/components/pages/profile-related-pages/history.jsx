import "../../../styles/profile-related-pages.css"
import { set_download_links_by_array } from "../../utils/common-server-calls";
import { useEffect, useState, useContext } from "react"
import { userContext } from "../../utils/contexts";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import PreviewPlayer from "../video-components/preview-player";

function LoadViewingHistory () {
    
    const [downloadLinks, setDownloadLinks] = useState() ; 
    const [videoNames, setVideoNames] = useState() ; 
    const [namesAndLinks, setNamesAndLinks] = useState() ; 
    const [videoHistoryArray, setVideoHistoryArray] = useState() ; 
    const {user, setUser} = useContext(userContext)

    const get_users_viewing_history = async () => {
        if (user.logged_in){
            const user_doc = doc(firestore, "users", user.uid) ; 
            const user_history = (await getDoc(user_doc)).data().playlists.history ; 
            setVideoHistoryArray(user_history) ;
        }
    }


    useEffect( () => {
        get_users_viewing_history() ; 
    }, [user])

    useEffect( () => {
        if (videoHistoryArray){
            set_download_links_by_array(videoHistoryArray, 
                setDownloadLinks, setVideoNames, setNamesAndLinks)
        }
    }, [videoHistoryArray])

    return (
        <div className="HomePage profile-related-page">
            <h1 className="profile-related-title">Your Viewing History</h1>
            <div className="profile-related-players">
            { namesAndLinks && videoNames.map( (name) => {
                return (
                <PreviewPlayer 
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
                video={namesAndLinks[name]}
                title={name}
                key={name}
                />
            )
            })} 
            </div>
        </div>
    )
}

export default LoadViewingHistory