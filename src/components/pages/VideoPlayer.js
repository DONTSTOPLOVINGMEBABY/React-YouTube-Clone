import { useLocation } from "react-router-dom"
import { storage, firestore } from "../../firebase/firebase";
import {doc, getDocs, getDoc, collection, query, where, updateDoc, increment} from "@firebase/firestore"
import { ref, getDownloadURL } from "firebase/storage";
import PreviewPlayer from "./video-components/preview-player";
import Subscribe from "../content-interaction-components/subscribe";
import LikeDislike from "../content-interaction-components/like-dislike";
import CreateAComment from "../content-interaction-components/make-a-comment";
import Comment from "../content-interaction-components/comment";
import { useEffect, useState, useRef } from "react";
import "../../styles/play-video.css"

function PlayVideo () {

    const [sideVideos, setSideVideos] = useState([]) ; 
    const [sideVideoObject, setSideVideoObject] = useState({}) ;
    const [profileUrl, setProfileUrl] = useState(null) ;  
    
    const location = useLocation() ;  
    
    const description_and_views = useRef() ; 
    const description_content = useRef() ; 
    const show_more_button = useRef() ; 
    const [showMoreLess, setShowMoreLess] = useState(false) ; 

    const [channel_information, setChannel_information] = useState(location.state.channel_information) ; 
    const [video_information, setVideo_information] = useState(location.state.video_information) ; 
    const video_time = location.state.video_time ; 
    const download_url = location.state.download_url ; 
    const [comments, setComments] = useState() ; 
    const [commentKeys, setCommentKeys] = useState() 
    const [views, setViews] = useState(video_information.view_count) ; 

    const load_side_videos = async () => { 
        let hold_category_videos = [], rest_videos = [], all_videos = [] ;  
        const videos_collection = collection(firestore, "videos") ; 
        const categories_query = query(videos_collection, where("category", "==", `${video_information.category}`)) ; 
        const categories_snapshot = await getDocs(categories_query) ; 
        categories_snapshot.forEach( (shot) => {hold_category_videos.push(shot.id.replace(/_/g, "/"))}) 
        // Grab rest of the videos  
        const docsnap = (await getDocs(videos_collection)).docs ; 
        docsnap.forEach( (data) => {
          rest_videos.push(data.id.replace(/_/g, '/'))
        })
        hold_category_videos = hold_category_videos.filter(item => item.split("/")[2] != `${video_information.title}`)

        while (hold_category_videos.length + all_videos.length < 10){
            let random_number = Math.floor(Math.random() * (rest_videos.length - 1)) ; 
            if (!all_videos.includes(rest_videos[random_number]) && !hold_category_videos.includes(rest_videos[random_number]) && 
            video_information.title != rest_videos[random_number].split("/")[2]) 
            {all_videos.push(rest_videos[random_number])}
        }
        // Get Download Links
        let all_together = [...hold_category_videos, ...all_videos] ; 
        
        let download_links = await Promise.all( 
            all_together.map( async (name) => {
                let download_ref = ref(storage, name) ; 
                return await getDownloadURL(download_ref) ; 
            })
        )
        // Lob it all into an object
        let names_and_links_object = {} ; 
        all_together.map( (name, index) => {
            names_and_links_object[name] = download_links[index] ; 
        })

        setSideVideos(all_together) ; 
        setSideVideoObject(names_and_links_object)
    }

    const grab_profile = async ( ) => {
        let profileRef = ref(storage, channel_information.avatar) ; 
        let url = await getDownloadURL(profileRef) ;
        setProfileUrl(url)
    }

    const update_video_view_count = async () => {
        let string = `Uploads_${video_information.creator}_${video_information.title}` ; 
        let video_doc = doc(firestore, "videos", string) ; 
        await updateDoc( video_doc, {
            "view_count" : increment(1), 
        })
        setViews(views + 1) ; 
    }

    const expand_description_section = () => {
        if (!showMoreLess) {
            description_content.current.style.height = "auto" ; 
            let readjust = description_content.current.offsetHeight ; 
            if (readjust > 39) {
                description_and_views.current.style.height = `${readjust + 75 - 19}px` ; 
            }
            else {
                description_content.current.style.height = "19px" ; 
                description_and_views.current.style.height = "75px" 
            }
            show_more_button.current.innerHTML = "Show Less"
        }
        else {
            description_content.current.style.height = "19px" ; 
            description_and_views.current.style.height = "75px" ; 
            show_more_button.current.innerHTML = "Show More"
        }
        setShowMoreLess(!showMoreLess)
    }

    const load_comments = async () => {
        let video_ref = doc(firestore, "videos", `Uploads_${video_information.creator}_${video_information.title}`) ; 
        let video_data =  (await getDoc(video_ref)).data() ; 
        console.log(video_data) ; 
        setComments(video_data.comments) ; 
        setCommentKeys(Object.keys(video_data.comments)) ; 
    }

    useEffect( () => {
        load_side_videos() ;
        grab_profile() ; 
        load_comments() ; 
    }, [])
    

    return (
        <div className="HomePage PlayVideo">
            <div id="specific" className="left-side">
                <div className="big-video-container">
                    <video id="play-big-video" controls onPlay={update_video_view_count}>
                        <source src={download_url} type="video/mp4"/>
                    </video>
                </div>
                <div id="video-descriptions">
                    <div className="description-title">{video_information.title.split(".")[0]}</div>
                    <div className="description-lower-half">
                        <div id="owner">
                            <div id="owner-info">
                                <img id="owner-profile-picture" src={profileUrl} alt="Profile-Picture" />
                                <div id="owner-name-sub-count">
                                    <div id="owner-name">{channel_information.channel_name}</div>
                                    <div id="owner-sub-count">{channel_information.subscribers} subscribers</div>
                                </div>
                            </div>
                            <Subscribe current_channel={channel_information.channel_name}/> 
                        </div>
                        <div id="lower-half-right">
                            <div id="lower-half-right-inner">
                                <LikeDislike 
                                title={video_information.title} 
                                /> 
                            </div>
                        </div>
                    </div>
                    <div id="description-and-views" ref={description_and_views} onClick={expand_description_section}>
                        <div className="views-and-upload-date">
                            <div id="views">{views} views</div>
                            <div id="upload-date-description">{video_information.upload_date}</div>
                        </div>
                        <div id="description-content" ref={description_content}>{video_information.description}</div>
                        <div id="expand-button" ref={show_more_button}>Show More</div>
                    </div>
                    <div id="comments">
                        <CreateAComment video_title={`Uploads_${video_information.creator}_${video_information.title}`} 
                         setComments={setComments} comments={comments} setCommentKeys={setCommentKeys} commentKeys={commentKeys}
                         video_information={video_information} setVideo_information={setVideo_information}/> 
                        {commentKeys && comments ? <div id="load-all-comments">
                            { commentKeys.map( (commentKey) => {
                                return (<Comment comment={comments[commentKey]} setComments={setComments} key={commentKey}
                                    video_title={`Uploads_${video_information.creator}_${video_information.title}`}
                                    commentKey={commentKey}/>)
                            })} </div>
                        : null } 
                        <div id="buffer-height-between-last-comment"></div>
                    </div>
                </div>
            </div>
            <div className="right-side">
                { sideVideoObject && sideVideos && sideVideos.map( (name) => { 
                    return ( 
                    <PreviewPlayer
                    className="play-video-main-class"
                    main_container="play-video-main-container"
                    video_class="play-video-video"
                    video_information="play-video-video-information"
                    profile_picture="play-video-profile-picture"
                    profile_photo="play-video-recommended-profile-picture"
                    other_information="play-video-other-information"
                    video_title="play-video-title"
                    video_channel="play-video-channel"
                    views="play-video-sidebar-views"
                    date="play-video-sidebar-date"
                    group="play-video-group"
                    video={sideVideoObject[name]}
                    title={name}
                    key={name}
                    play={false}
                    /> )
                })}
            </div>            
        </div>
    )
}

export default PlayVideo 