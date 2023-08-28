import { userContext } from "../../utils/contexts"
import { useContext, useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { set_download_links_by_array } from "../../utils/common-server-calls";
import PreviewPlayer from "../video-components/preview-player";

function LoadWatchLater () {

    const [downloadLinks, setDownloadLinks] = useState() ; 
    const [videoNames, setVideoNames] = useState() ; 
    const [namesAndLinks, setNamesAndLinks] = useState() ; 
    const [watchLaterArray, setWatchLaterArray] = useState() ; 
    const {user, setUser} = useContext(userContext)


    const get_users_watch_later = async () => {
        if (user.logged_in){
            let user_doc = doc(firestore, "users", user.uid)
            let watch_later_bucket = (await getDoc(user_doc)).data().playlists.watch_later ;
            setWatchLaterArray(watch_later_bucket) ; 
        }
    }

    useEffect( () => {
        get_users_watch_later() ; 
    }, [user])

    useEffect( () => {
        if (watchLaterArray){
            set_download_links_by_array(watchLaterArray, setDownloadLinks,
                setVideoNames, setNamesAndLinks) ; 
        }
    }, [watchLaterArray])

    return (
        <div className="HomePage profile-related-page">
            <h1 className="profile-related-title">Watch Later Playlist</h1>
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

export default LoadWatchLater