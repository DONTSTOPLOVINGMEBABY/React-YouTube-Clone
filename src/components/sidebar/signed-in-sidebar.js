import "../../styles/sidebar.css"
import Category from "./sidebar-comps/category"
import {subscriptions_section_images} from "../utils/export-image-objects"
import { GeneralNavSection } from "./sidebar-comps/general-nav-section"
import { AboutCategory } from "./sidebar-comps/miscallenous-section"
import { ExploreCategories} from "./sidebar-comps/explore-categories-section" 
import { ProfileRelatedLinks } from "./sidebar-comps/profile-related-links-section"
import { useState, useContext, useEffect } from "react"
import { userContext } from "../utils/contexts"
import { getDocs, collection, query, where, doc, getDoc } from "@firebase/firestore" 
import { firestore, storage } from "../../firebase/firebase"
import { getDownloadURL, ref } from "firebase/storage" 
import Logout from "./sidebar-comps/logout"


function SideBar () {


    const [subscribedChannels, setSubscribedChannels] = useState(null) ;
    const [subscribedProfilePhotos, setSubscribedProfileChannels] = useState(null) ;  
    const {user, setUser} = useContext(userContext)

    const get_subscribers = async () => {
        const docRef = doc(firestore, "users", user.uid) ; 
        const user_data = await getDoc(docRef) ; 
        const subscribers = user_data.data().playlists.subscriptions  ; 
        
        const profile_photos_links = await Promise.all( 
            subscribers.map( async (sub) => {
              const subRef = doc(firestore, "users", sub) ; 
              const getData = await getDoc(subRef) ; 
              const link = getData.data().avatar ; 
              const urlRef = ref(storage, link) ; 
              const url = await getDownloadURL(urlRef) ; 
              return url ; 
            })
         )

         setUser({...user, subscribers: subscribers}) ; 

         // Only show 7 subscriptions
        //  if (profile_photos_links.length > 8){
        //     profile_photos_links.splice(7, profile_photos_links.length) ; 
        // }

        const temp_object = {}
        profile_photos_links.map( (link, index) => {
            temp_object[subscribers[index]] = link ; 
        }) 
        setSubscribedChannels(subscribers)
        setSubscribedProfileChannels(temp_object) ; 
    }


    useEffect( () => {
        get_subscribers() ; 
    }, [])



    return (
        <div className="sidebar">
            <div className="general-nav-links">
                <GeneralNavSection/>
            </div>
            <div className="sidebar-profile-related-links category-border">
                <ProfileRelatedLinks/>
            </div>
            <div className="subscriptions category-border" >
                <h3 className="sidebar-subtitle">Subscriptions</h3>
                {/* Replace this with user's subscriptions */}
                { subscribedChannels && setSubscribedProfileChannels && subscribedChannels.map( (sub, index) => {
                    
                    return ( <Category 
                        icon={subscribedProfilePhotos[sub]}
                        text={sub}
                        key={sub} 
                    />)  
                })}
                <Category 
                    icon={subscriptions_section_images.arrow_over_icon}
                    text="All Subscriptions"
                /> 
            </div>
            <div className="display-categories category-border">
                <ExploreCategories />
            </div>
            <div className="miscallenous-sidebar category-border">
                <AboutCategory/>
                <Logout />
            </div>
        </div>
    )
}

export default SideBar