import "../../../styles/header.css" 
import Subscribe, {subscribe} from "../../content-interaction-components/subscribe"
import { useContext, useEffect } from "react"
import { userContext } from "../../utils/contexts"
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

function ChannelSearchResult (props) {

    const {user, setUser} = useContext(userContext) ; 

    const get_subscribers = async () => {
        let user_data = (await getDoc(doc(firestore, "users", user.uid))).data() 
        setUser({...user, subscribers : user_data.playlists.subscriptions}) ; 
    }
    
    useEffect( () => {
        if (user){get_subscribers()}
    }, [])

    return (
        <div className="channel-search-result">
            <div id="channel-search-profile-container">
                <img id="channel-search-profile" src={props.data.avatar} alt="profile-picture"/>
            </div>
            <div id="channel-search-profile-info">
                <span>{props.data.channel_name}</span>
                <span>@{props.data.channel_name} &#183; {props.data.subscribers} subscribers</span>
                <span>{props.data.total_channel_views} total views</span>
            </div>
            <div id="channel-search-subscribe">
                <Subscribe channel_information={props.data} 
                current_channel={props.name}/>
            </div>
        </div>
    )
}


export default ChannelSearchResult