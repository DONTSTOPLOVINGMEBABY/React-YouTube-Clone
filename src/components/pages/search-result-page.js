import "../../styles/header.css"
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { default_channels } from "../utils/common-server-calls";
import { firestore, storage} from "../../firebase/firebase";
import { doc, getDocs, query, where, getDoc, collection } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import PreviewPlayer from "../pages/video-components/preview-player"
import ChannelSearchResult from "../header/search-bar-comps/channel";

function SearchResultsPage(props) {

    const location = useLocation() ; 
    const [videos, setVideos] = useState(location.state.videos) ; 
    const [channels, setChannels] = useState(location.state.channels) ; 
    const [serverTitleNames, setServerTitleNames] = useState(location.state.serverTitleNames) ; 

    const [channelNamesAndData, setChannelNamesAndData] = useState(null) ; 
    const [videoNamesAndData, setVideoNamesAndData] = useState(null) ; 

    const get_channel_information = async () => {
        let channel_names_and_data = {}        
        let channel_data = await Promise.all( 
            channels.map( async (channel) => {
                let channel_query = query( collection(firestore, "users"), where("channel_name", "==", channel))
                let data = (await getDocs(channel_query)).docs[0].data() ;
                let download_url ; 
                if (default_channels.includes(channel)){
                    let channel_ref = ref(storage, data.avatar) ; 
                    download_url = await getDownloadURL(channel_ref) ;
                    data.avatar = download_url ;  
                } 
                channel_names_and_data[channel] = data ;
                return data ; 
            })
        )
        setChannelNamesAndData(channel_names_and_data) ; 
    }

    const get_video_information = async () => {
        let video_names_and_data = {} 
        let video_data = await Promise.all( 
            videos.map( async video => {
                let download_ref = ref(storage, serverTitleNames[video][0]) ;
                // let video_data = (await getDoc(doc(firestore, "videos", serverTitleNames[video][0].replace(/\//g, "_")))).data() ; 
                let download_url = await getDownloadURL(download_ref) ; 
                video_names_and_data[video] = download_url ; 
            })
        )
        setVideoNamesAndData(video_names_and_data) ; 
    }
    
    useEffect( () => {
        get_channel_information() ;
        get_video_information() ;       
    }, [])


    return (
        <div className="HomePage Search-Results">
            <div className="Search-Results-Container">
                { channels ? <div id="display-channels-search">
                    {channelNamesAndData && videoNamesAndData && channels.map( (channel) => {
                        return (
                            <ChannelSearchResult 
                            data={channelNamesAndData[channel]} 
                            name={channel}
                            key={channel}
                            /> 
                        )
                    })}
                </div> : null } 
                <div id="display-videos-search">
                    { channelNamesAndData && videoNamesAndData && videos.map( (video) => {
                        return (
                            <PreviewPlayer 
                            className="search-page-player"
                            main_container="search-video-container"
                            video_class="video"
                            video_information="search-video-information-main"
                            profile_picture="profile-picture-main"
                            profile_photo="profile-photo-homepage-player" 
                            other_information="other-information-search"
                            video_title="search-video-title-homepage"
                            video_channel="channel-name-homepage"
                            group="group-homepage"
                            views="views-homepage"
                            date="upload-date-homepage"
                            play={false}
                            video={videoNamesAndData[video]} 
                            title={serverTitleNames[video][0]}
                            key={video}
                            /> 
                        )
                    })}
                </div>
            </div>
        </div>
    )

}

export default SearchResultsPage