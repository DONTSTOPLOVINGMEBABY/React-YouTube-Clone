import {doc, getDoc, collection, getDocs, updateDoc, increment, arrayRemove, arrayUnion, query, where} from "@firebase/firestore"
import { firestore, storage } from "../../firebase/firebase"
import default_channel_photo from "../assets/default-user-photos/default-channel-photo.jpg"
import "../../styles/channel-page.css" ; 
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Subscribe from "../content-interaction-components/subscribe";
import PreviewPlayer from "./video-components/preview-player";
import { getDownloadURL, ref } from "firebase/storage";
import { set_download_links_by_creator } from "../utils/common-server-calls";

function ChannelPage () {

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

    const location = useLocation() ; 

    const [channel_photo, setChannel_photo] = useState() ; 
    const [profilePhoto, setProfilePhoto] = useState()
    const [channelName, setChannelName] = useState("Hankus")
    const [subscribers, setSubscribers] = useState(23) ; 
    const [numberOfViews, setNumberOfViews] = useState(5) ;
    const [channelInformation, setChannelInformation] = useState(location.state.channel_information) ;  
    const [downloadLinks, setDownloadLinks] = useState(null) ; 
    const [videoNames, setVideoNames] = useState(null) ; 
    const [namesAndLinks, setNamesAndLinks] = useState(null) ; 

    const setInitialVariables = async () => {
        setChannelName(channelInformation.channel_name)
        setSubscribers(channelInformation.subscribers) ; 
        if (default_channels.includes(channelInformation.channel_name)){
            let channel_ref = ref(storage, channelInformation.avatar) ;  
            let url = await getDownloadURL(channel_ref) ; 
            setProfilePhoto(url) ;
            setChannel_photo(url) ; 
        }
        else {
            setProfilePhoto(channelInformation.avatar)
            setChannel_photo(channelInformation.avatar) ; 
        }
    }


    useEffect( () => {
        if (channelInformation){setInitialVariables()}
        set_download_links_by_creator(channelInformation.channel_name, setDownloadLinks, setVideoNames, setNamesAndLinks) ; 
    }, [channelInformation])


    return ( 
        <div className="HomePage ChannelPage">
            <div id="channel-photo-container-1">
                <div id="channel-photo-container-2">
                    <img id="channel-photo" src={channel_photo} alt="channel-profile-photo"/>
                </div>
                <div id="channel-info-and-subscribe">
                    <div id="channel-page-channel-info">
                        <img id="channel-page-profile-picture" src={profilePhoto} alt="profile_picture"/>
                        <div id="channel-page-info">
                            <h3 id="channel-name-channel-page">{channelName}</h3>
                            <div id="channel-subinfo-channel-page">
                                <span id="channel-handle">@{channelName}</span>
                                <span id="channel-subscribers">{subscribers} subscribers</span>
                                <span id="number-of-videos">{numberOfViews} total views</span>
                            </div>
                        </div>
                    </div>
                    <div id="subscribe-button-channel-page">
                        <Subscribe current_channel={channelInformation.channel_name}/>
                    </div>
                </div>
                <div id="load-videos-channel-page">
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
        </div>    
    )
}

// we need the channel name we're trying to find
// 
// we need all of the download links associated with the channel
// we need all of the associated names with the download links


export default ChannelPage
