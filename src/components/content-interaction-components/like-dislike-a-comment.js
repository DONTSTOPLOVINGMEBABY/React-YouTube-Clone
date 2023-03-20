import {doc, updateDoc, increment, arrayRemove, arrayUnion} from "@firebase/firestore"
import { firestore } from "../../firebase/firebase";


const like = async (setLiked, liked, user, setDisliked, 
    disliked, likes, setLikes, video_name_on_server, commentKey, reply=false, replyKey=null) => {  

    if (!user.uid){alert("You must sign in or create an account to use this feature") ; return}
    setDisliked(false) ; 
    let videoRef = doc(firestore, "videos", video_name_on_server) ; 
    let path ; 
    if (!reply) { path = `comments.${commentKey}` }
    else { path = `comments.${commentKey}.replies.${replyKey}` } // make this work for reply 
    console.log(path) ; 
    if (!liked && !disliked) {
        setLikes(likes + 1) ;
        setLiked(true) ;        
        await updateDoc(videoRef, {
            [`${path}.likes`] : increment(1), 
            [`${path}.users_who_have_liked_this`] : arrayUnion(user.uid), 
        })
    }
    if (!liked && disliked) {
        setLikes(likes + 1) ;
        setLiked(true) ;
        await updateDoc(videoRef, {
            [`${path}.likes`] : increment(1),
            [`${path}.dislikes`] : increment(-1), 
            [`${path}.users_who_have_liked_this`] : arrayUnion(user.uid), 
            [`${path}.users_who_have_disliked_this`] : arrayRemove(user.uid), 
        })  
    }
    if (liked && !disliked){
        setLikes(likes - 1) ;
        setLiked(false) ; 
        await updateDoc(videoRef, {
            [`${path}.likes`] : increment(-1), 
            [`${path}.users_who_have_liked_this`] : arrayRemove(user.uid)
        }) 
    }       
}

const dislike = async (setLiked, liked, user, setDisliked, 
    disliked, likes, setLikes, video_name_on_server, commentKey, reply=false, replyKey = null) => {
    
    if (!user.uid){alert("You must sign in or create an account to use this feature") ; return}
    setLiked(false) ; 
    let videoRef = doc(firestore, "videos", video_name_on_server) ; 
    let path ; 
    if (!reply) { path = `comments.${commentKey}` }
    else { path = `comments.${commentKey}.replies.${replyKey}` } // make this work for reply 
    if (!disliked & !liked) {
        setDisliked(true) ; 
        await updateDoc(videoRef, {
            [`${path}.dislikes`] : increment(1), 
            [`${path}.users_who_have_disliked_this`] : arrayUnion(user.uid), 
        })
    }
    if (!disliked && liked){
        setDisliked(true) ; 
        await updateDoc(videoRef, {
            [`${path}.likes`] : increment(-1), 
            [`${path}.dislikes`] : increment(1), 
            [`${path}.users_who_have_disliked_this`] : arrayUnion(user.uid),
            [`${path}.users_who_have_liked_this`] : arrayRemove(user.uid),
        })
        setLikes(likes - 1) ; 
    }
    if (disliked & !liked) {
        setDisliked(false) ; 
        await updateDoc(videoRef, {
            [`${path}.dislikes`]: increment(-1), 
            [`${path}.users_who_have_disliked_this`] : arrayRemove(user.uid),
        })
    }
}

export {like, dislike} ;