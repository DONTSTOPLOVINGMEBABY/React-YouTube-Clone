import { firestore, storage } from "../../firebase/firebase";
import {doc, getDocs, getDoc, collection, query, where} from "@firebase/firestore" 
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";


function PreviewPlayer (props) {

    const [videoInformation, setVideoInformation] = useState(null) ; 
    const [channelInfo, setChannelInfo] = useState(null) ; 
    const [profileURL, setProfileURL] = useState(null) ; 
    const [uploadTimeDifferece, setUploadTimeDifference] = useState(null) ; 
    const videoRef = useRef() ;
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

    const grab_profile_photo = async () => {
        if (default_channels.includes(channelInfo.channel_name)){
            if (channelInfo) {        
                const profile_reference = ref(storage, channelInfo.avatar) ; 
                const link = await getDownloadURL(profile_reference) ;
                setProfileURL(link)  
            } 
        } 
        else {
            setProfileURL(channelInfo.avatar) 
        }
    }

    const calculate_date_difference = () => {
        const upload_date = new Date(videoInformation.upload_date) ; 
        const current_date = new Date() ; 
        let time_difference = upload_date.getTime() - current_date.getTime();
        let day_difference = Math.abs(Math.ceil(time_difference / (1000 * 3600 * 24)));
        setUploadTimeDifference(day_difference) ; 
    }

    const get_video_info = async () => {
        const doc_name = props.title.replace(/\//g, "_") ; 
        const document_reference = doc(firestore, "videos", `${doc_name}`) ; 
        const information = await getDoc(document_reference) ; 
        const data = information.data() ; 
        setVideoInformation(data) ;  
    }

    const get_channel_information = async (channel_name) => {
        let query1 ; 
        if (default_channels.includes(channel_name)){
            const users_collection = collection(firestore, "users") ; 
            query1 = query(users_collection, where("channel_name", "==", `${channel_name}`)) ; 
        }
        else {
            const users_collection = collection(firestore, "users") ; 
            query1 = query(users_collection, where("uid", "==", `${channel_name}`)) ; 
        }
        
        let data = await getDocs(query1) ; 
        data = data.docs[0].data() ; 
        setChannelInfo(data) ; 
    }

    const load_video = () => {
    
        navigate(`/video-player/${channelInfo.channel_name}#${videoInformation.title.split(".")[0]}`, { state : {
            video_information: videoInformation, 
            channel_information : channelInfo, 
            video_time : videoRef.current.currentTime ,
            download_url : props.video,  
        }})
        window.location.reload() ; 
    }  

    const load_channel = (event) => {
        event.stopPropagation();
        navigate(`/channel-page/${channelInfo.channel_name}`, { state : {
            channel_information : channelInfo, 
        }})
    }


    const playVideo = () => {
        if (props.play){videoRef.current.play()}
    }

    const pauseVideo = () => {
        if (props.play){videoRef.current.pause()}
    }

    useEffect( () => {
        get_video_info() ; 
        const channel = props.title.split("/")[1] ; 
        get_channel_information(channel) ; 
    }, [])

    useEffect( () => {
        if (channelInfo && videoInformation){
            grab_profile_photo()
            calculate_date_difference() ;
        }
    }, [channelInfo, videoInformation])


    return (
        <div className={props.className} onMouseEnter={playVideo} onClick={load_video} onMouseLeave={pauseVideo}>
            { videoInformation && profileURL && channelInfo ? <>
                <div className={props.main_container}>
                    <video className={props.video_class} preload="metadata" ref={videoRef} muted>
                        <source src={props.video} type="video/mp4"/>
                    </video>
                </div>
                <div className={props.video_information}>
                    <div className={props.profile_picture}>
                        <img onClick={load_channel} id={props.profile_photo} src={profileURL} alt="avatar"/>
                    </div>
                    <div className={props.other_information}>
                        <div className={props.video_title}>{videoInformation.title.split(".")[0]}</div>
                        <div onClick={load_channel} className={props.video_channel}>{videoInformation.creator}</div>
                        <div className={props.group}>
                            <div className={props.views}>{videoInformation.view_count} views &#183; </div>
                            <div className={props.date}> {uploadTimeDifferece} days ago</div>
                        </div>
                    </div>
                </div>
                </>
                : null
            }  
        </div>

    )
}

export default PreviewPlayer