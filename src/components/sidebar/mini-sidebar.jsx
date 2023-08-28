import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { userContext } from "../utils/contexts";
import { mini_sidebar_icons } from "../utils/export-image-objects"
import MiniCategory from "./sidebar-comps/mini-category"
import { useFlag } from 'feature-toggles-react-sdk'

function MiniSideBar () {

    const navigate = useNavigate() ; 
    const {user, setUser} = useContext(userContext) ;  

    const go_home = () => { navigate("/") } ; 

    const show_subscribers = () => { navigate("/subscriptions") } ; 

    const show_profile = async () => {
        let channel_information = (await getDoc(doc(firestore, "users", user.uid))).data() ; 
        console.log(channel_information)
        navigate(`/channel-page/${user.channel_name}`, {state : {
            channel_information : channel_information, 
        }})
        window.location.reload() ; 
    }

    const show_about = () => { navigate("/about") } ;

    const showSideabar = useFlag('sidebar.whole-sidebar')


    return (
        showSideabar ? <div className="mini-sidebar">
            <MiniCategory 
            icon={mini_sidebar_icons.home_icon}
            text="Home"
            click={go_home}
            />
            <MiniCategory 
            icon={mini_sidebar_icons.subscriptions_icon}
            text="Subscriptions"
            click={show_subscribers}
            />
            <MiniCategory 
            icon={mini_sidebar_icons.profile_icon}
            text="Profile"
            click={show_profile}
            />
            <MiniCategory 
            icon={mini_sidebar_icons.about_icon}
            text="About"
            click={show_about} 
            />
        </div> : null  
    )
}

// Home 
// All Subscriptions
// Profile
// About

export default MiniSideBar