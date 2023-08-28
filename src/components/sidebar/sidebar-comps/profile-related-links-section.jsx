import Category from "./category";
import {getDoc, doc} from "firebase/firestore"
import { firestore } from "../../firebase/firebase";
import { sidebar_profile_related_links_images } from "../../utils/export-image-objects";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../utils/contexts";

function ProfileRelatedLinks () {

    let navigate = useNavigate() ;
    const {user, setUser} = useContext(userContext) ;  

    const go_to_your_page = async () => {
        let channel_information = (await getDoc(doc(firestore, "users", user.uid))).data() ; 
        console.log(channel_information)
        navigate(`/channel-page/${user.channel_name}`, {state : {
            channel_information : channel_information, 
        }})
        window.location.reload() ; 
    }

    const see_your_history = () => {
        navigate("/viewing-history") ; 
    }

    const see_your_likes = () => {
        navigate("/liked-videos") ; 
    }

    const see_your_watch_later_playlist = () => {
        navigate("/watch-later")
    }

    return (
        <div>
            <Category 
                icon={sidebar_profile_related_links_images.history_icon}
                text="History"
                click={see_your_history}
                />
                <Category 
                icon={sidebar_profile_related_links_images.your_videos_icon}
                text="Your Videos"
                click={go_to_your_page}
                />
                <Category 
                icon={sidebar_profile_related_links_images.clock_icon}
                text="Watch Later"
                click={see_your_watch_later_playlist}
                />
                <Category 
                icon={sidebar_profile_related_links_images.likes_icon}
                text="Liked Videos"
                click={see_your_likes}
                />
        </div>
    )
}

export {ProfileRelatedLinks} 