import "../../../styles/header.css" 
import Subscribe, {subscribe} from "../../content-interaction-components/subscribe"
import { useContext, useEffect } from "react"
import { userContext } from "../../utils/contexts"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../../firebase/firebase";

function ChannelSearchResult (props) {

    const {user, setUser} = useContext(userContext) ; 
    const navigate = useNavigate() ; 

    const load_channel = async (name) => {
        let channel_collection = collection(firestore, "users") ; 
        let channel_query = query(channel_collection, where("channel_name", "==", `${name}`)) ; 
        let channel_information = (await getDocs(channel_query)).docs[0].data();
        navigate(`/channel-page/${channel_information.channel_name}`, {state : {
            channel_information : channel_information,
        }})
        window.location.reload() ; 
    }   

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
                <img id="channel-search-profile" src={props.data.avatar} alt="profile-picture"
                onClick={() => load_channel(props.name)}/>
            </div>
            <div id="channel-search-profile-info">
                <span onClick={() => load_channel(props.name)} id="search-channel-name">{props.data.channel_name}</span>
                <span id="search-channel-info-mini"><span onClick={() => load_channel(props.name)} id="search-mini-channel-name">@{props.data.channel_name}</span> 
                &#183; {props.data.subscribers} subscribers</span>
                <span id="total-views-search-channel">{props.data.total_channel_views} total views</span>
            </div>
            <div id="channel-search-subscribe">
                <Subscribe channel_information={props.data} 
                current_channel={props.name}/>
            </div>
        </div>
    )
}


export default ChannelSearchResult