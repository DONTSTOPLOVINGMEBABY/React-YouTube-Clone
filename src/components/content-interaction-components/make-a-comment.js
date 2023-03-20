import {doc, getDoc, collection, getDocs, updateDoc, increment, arrayRemove, arrayUnion, query, where} from "@firebase/firestore"
import { firestore } from "../../firebase/firebase"
import { useState, useEffect, useContext, useRef } from "react"
import { userContext } from "../utils/contexts";
import "../../styles/play-video.css"
import logged_out_profile_icon from "../assets/login-profile-white.svg" ; 

function CreateAComment (props) {

    const {user, setUser} = useContext(userContext) ; 
    const [activeComment, setActiveComment] = useState(false) ; 
    const commentInput = useRef(); 

    const enter_comment = () => {
        let string = commentInput.current.value.trimStart() ; 
        if (string){
            setActiveComment(true) ; 
        }
        else { 
            setActiveComment(false)  ; 
            commentInput.current.value = '' ; 
        }
    }

    const make_new_comment = (userid, date, comment, avatar, name) => {
        return {
            uid : userid, 
            date : date, 
            comment : comment, 
            likes : 0, 
            dislikes : 0, 
            replies : {}, 
            users_profile_id : avatar, 
            users_name : name, 
            users_who_have_liked_this : [], 
            users_who_have_disliked_this: [], 
        }
    }

    const submitComment = async () => {
        if (!user.uid){alert("You must sign in or create an account to use this feature") ; return}
        let videoDocRef = doc(firestore, "videos", props.video_title) ; 
        let now = new Date() ; 
        now = now.getTime() ; 
        let comment = make_new_comment(user.uid, now, commentInput.current.value.trim(), user.profile_url, `${user.first_name} ${user.last_name}`) ; 
        let old_comments = (await getDoc(videoDocRef)).data()["comments"] ;
        await updateDoc( videoDocRef, {
            "comments" : {
                [`${user.uid}_${now}`] : comment, 
                ...old_comments, 
            }
        })
        commentInput.current.value = '' ; 
        let temp_comments = props.comments ; 
        props.setComments({...temp_comments, ...{[`${user.uid}_${now}`] : comment}}) ; 
        props.setCommentKeys([`${user.uid}_${now}`, ...props.commentKeys,]) ; 
        props.setVideo_information( prevState => ({
            ...prevState, 
            comments : {
                ...{[`${user.uid}_${now}`] : comment}, 
                ...prevState.comments, 
            }
        }))
    }

    return (
        <div id="create-a-comment">
            <div id="top-section-create-comment">
                <img id="comment-profile-avatar" src={user.profile_url ? user.profile_url : logged_out_profile_icon } alt="Profile Picture"/> 
                <input id="comment-input" type="text" ref={commentInput} onChange={enter_comment} 
                autoComplete="off" placeholder="Leave a comment..."/>
            </div>
            <div id="submit-comment-button-set">
                { activeComment ? 
                <button id="true-submit-comment-button" onClick={submitComment}>Comment</button> : 
                <button id="false-submit-comment-button">Comment</button> }
            </div>
        </div>
    )
}

export default CreateAComment