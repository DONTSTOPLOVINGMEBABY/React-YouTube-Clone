import {doc, getDoc, collection, getDocs, updateDoc, increment, arrayRemove, arrayUnion, query, where} from "@firebase/firestore"
import { useEffect, useState, useContext } from "react"
import { firestore} from "../../firebase/firebase"
import { userContext } from "../utils/contexts";
import notActiveLikeButton from "../assets/not-active-like.svg"
import notActiveDislikeButton from "../assets/not-active-dislike.svg"
import activeLikeButton from "../assets/active-like.svg"
import activeDislikeButton from "../assets/active-dislike.svg"



function LikeDislike (props) {

    const {user, setUser} = useContext(userContext) ; 
    const [disliked, setDisliked] = useState(false) ; 
    const [liked, setLiked] = useState(false) ; 
    const [likes, setLikes] = useState() ; 

    const [userRef, setuserRef] = useState() ; 
    const [videoRef, setVideoRef] = useState() ;
    const [videoTitleOnServer, setVideoTitleOnServer] = useState() ; 

    const get_initial_data = async () => {

        const videoCollection = collection(firestore, "videos") ; 
        const videoQuery = query(videoCollection, where("title", "==", props.title))
        const videoQuerySnapshot = await getDocs(videoQuery) ; 
        const video_title_on_server = videoQuerySnapshot.docs[0].id ; 
        const likes = videoQuerySnapshot.docs[0].data().likes ; 
        const videoRef = doc(firestore, "videos", video_title_on_server) ;  

        if (user.uid) {
            const userRef = doc(firestore, "users", user.uid) ;
            const user_data = await getDoc(userRef) ;
            const disliked = user_data.data().playlists.dislikes.includes(video_title_on_server) ; 
            const liked = user_data.data().playlists.likes.includes(video_title_on_server) ;
            if (disliked) {setDisliked(true)} ; 
            if (liked) {setLiked(true)} ;  
            setuserRef(userRef) ;
        }
        
        setVideoRef(videoRef) ; 
        setLikes(likes) ; 
        setVideoTitleOnServer(video_title_on_server) ; 
    }

    const like = async () => {  
        if (!user.uid){alert("You must sign in or create an account to use this feature") ; return}
        setDisliked(false) ; 
        if (!liked && !disliked) {
            setLikes(likes + 1) ;
            setLiked(true) ;  
            await updateDoc(userRef, {
                "playlists.likes" : arrayUnion(videoTitleOnServer),   
            })
            await updateDoc(videoRef, {
                "likes" : increment(1), 
            })
        }
        if (!liked && disliked) {
            setLikes(likes + 1) ;
            setLiked(true) ;
            await updateDoc(userRef, {
                "playlists.likes" : arrayUnion(videoTitleOnServer),   
                "playlists.dislikes" : arrayRemove(videoTitleOnServer), 
            })
            await updateDoc(videoRef, {
                "likes" : increment(1),
                "dislikes" : increment(-1), 
            })  
        }
        if (liked && !disliked){
            setLikes(likes - 1) ;
            setLiked(false) ; 
            await updateDoc(userRef, {
                "playlists.likes" : arrayRemove(videoTitleOnServer),   
            })
            await updateDoc(videoRef, {
                "likes" : increment(-1), 
            }) 
        }        
    }

    const dislike = async () => {
        if (!user.uid){alert("You must sign in or create an account to use this feature") ; return}
        setLiked(false) ; 
        if (!disliked & !liked) {
            setDisliked(true) ; 
            await updateDoc(userRef, {
                "playlists.dislikes" : arrayUnion(videoTitleOnServer),   
            })
            await updateDoc(videoRef, {
                "dislikes" : increment(1)
            })
        }
        if (!disliked && liked){
            setDisliked(true) ; 
            await updateDoc(userRef, {
                "playlists.dislikes" : arrayUnion(videoTitleOnServer),
                "playlists.likes" : arrayRemove(videoTitleOnServer), 
            })
            await updateDoc(videoRef, {
                "likes" : increment(-1), 
                "dislikes" : increment(1), 
            })
            setLikes(likes - 1) ; 
        }
        if (disliked & !liked) {
            await updateDoc(userRef, {
                "playlists.dislikes" : arrayRemove(videoTitleOnServer),
            })
            setDisliked(false) ; 
            await updateDoc(videoRef, {
                "dislikes" : increment(-1)
            })
        }
    }


    /* 
    conditions for like : 
        1. Dislike and Like are false 
            - Increment Video's Like Counter
            - Add video to user's liked playlist

        2. Dislike true and like false : 
            - Subtract one from the video's discount counter
            - Add one to the video's like counter
            - Remove video user's from dislikes
            - Add video to user's likes

        3. Like true and dislike false
            - Remove video from user's liked playlist
            - Decrement Like Video's Like Counter 

    */

    useEffect( () => {
        get_initial_data() ; 
    }, [user])

    return (
        <div id="like-dislike-buttons-container">
            <button className="button-interact button-hover" id="like-button">
                <img 
                className="like-button-icon-interact" 
                onClick={like} 
                src={ liked ? activeLikeButton : notActiveLikeButton } 
                alt="Like icon"/><span id="number-of-likes">{likes}</span>
            </button>
            <button className="button-interact button-hover" id="dislike-button">
                <img 
                className="like-button-icon-interact" 
                onClick={dislike} 
                src={ disliked ? activeDislikeButton : notActiveDislikeButton } 
                alt="Like icon"/>
            </button>
        </div>
    )
}


export default LikeDislike ; 
