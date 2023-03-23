import "../../styles/profile-related-pages.css"
import { useEffect, useContext, useState } from "react"
import {userContext} from "../utils/contexts" 
import {firestore, storage} from "../../firebase/firebase"
import {doc, getDoc, getDocs, where, collection, query} from "@firebase/firestore"
import { ref, getDownloadURL } from "firebase/storage"
import { useNavigate } from "react-router-dom"

function ShowSubscriptions () {
    
    const {user, setUser} = useContext(userContext) ;  
    const [videoNames, setVideoNames] = useState() ; 
    const [namesAndLinks, setNamesAndLinks] = useState() ; 

    const navigate = useNavigate() ; 

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

    const getUsersSubscriptions = async () => {
        if (user.logged_in){ 
            let default_profiles = [], user_profiles = [], user_profile_links = [], final_links_and_names = {} ; 
            let user_doc = doc(firestore, "users", user.uid) ; 
            let subscriptions = (await getDoc(user_doc)).data().playlists.subscriptions ; 
            let users_collection = collection(firestore, "users")
            let avatars = await Promise.all( 
                subscriptions.map( async (subscriber) => {
                    let avatar_query = query(users_collection, where("channel_name", "==", subscriber)) ; 
                    let avatar = (await getDocs(avatar_query)).docs[0].data().avatar ;
                    if (default_channels.includes(subscriber)){default_profiles.push(avatar)}
                    else {user_profiles.push(subscriber) ; user_profile_links.push(avatar)} 
                    return avatar ;  
                })
            )

            let default_download_links = await Promise.all( 
                default_profiles.map( async (profile) => {
                    let profile_ref = ref(storage, profile) ; 
                    return await getDownloadURL(profile_ref) ; 
                })
            )

            let new_titles = default_profiles.map( (profile, index) => {
                let split_name = profile.split("/")[1].split(".")[0].replace(/-/g, " ") ; 
                final_links_and_names[split_name] = default_download_links[index] ; 
                return split_name ; 
            })

            user_profiles.map( (profile, index) => {
                final_links_and_names[profile] = user_profile_links[index] ;  
            })
            
            setVideoNames([...new_titles, ...user_profiles])
            setNamesAndLinks(final_links_and_names)
        }
    }

    const load_channel = async (name) => {
        let channel_collection = collection(firestore, "users") ; 
        let channel_query = query(channel_collection, where("channel_name", "==", `${name}`)) ; 
        let channel_information = (await getDocs(channel_query)).docs[0].data();
        navigate(`/channel-page/${channel_information.channel_name}`, {state : {
            channel_information : channel_information,
        }})
        window.location.reload() ; 
    }   


    useEffect( () => {
        getUsersSubscriptions() ; 
    }, [user])






    return (
        <div className="HomePage show-subscriptions">
            <h1 className="profile-related-title">Your Subscriptions</h1>
            <div id="all-subscribers">
                { namesAndLinks && videoNames.map( (name) => {
                    return (
                        <div key={name} className="individual-subscriber" onClick={() => load_channel(name)} >
                            <img className="subscriber-profile-photo" src={namesAndLinks[name]} alt="channel-profile-photo"/>
                            <span className="subscriber-title">{name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ShowSubscriptions