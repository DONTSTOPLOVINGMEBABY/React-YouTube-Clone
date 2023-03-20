import {doc, getDoc, collection, getDocs, updateDoc, increment, arrayRemove, arrayUnion, query, where} from "@firebase/firestore"
import { firestore } from "../../firebase/firebase"
import notActiveLikeButton from "../assets/not-active-like.svg"
import notActiveDislikeButton from "../assets/not-active-dislike.svg"
import activeLikeButton from "../assets/active-like.svg"
import activeDislikeButton from "../assets/active-dislike.svg"
import { useState, useContext } from "react"
import { userContext } from "../utils/contexts"
import { like, dislike } from "./like-dislike-a-comment"

function ReplyToComment (props) {

    const pretty_print_date = (timestring) => {
        const date = new Date(timestring); 
        const day = ("0" + date.getDate()).slice(-2); 
        const month = ("0" + (date.getMonth() + 1)).slice(-2); 
        const year = date.getFullYear().toString().slice(-2); 
        return `${month}/${day}/${year}`;
    }

    const [liked, setLiked] = useState(false) ; 
    const [disliked, setDisliked] = useState(false) ; 
    const [likes, setLikes] = useState(props.reply.likes) ; 
    const {user, setUser} = useContext(userContext) ; 

    console.log(props.replyKey) ; 

    return (
        <div className="comment-reply">
            <img id="comment-profile-avatar" src={props.reply.users_profile_id} alt="profile-picture"/>
            <div className="comments-likes-and-replies">
                <div className="name-and-date-comments">
                    <span className="display-name-comments">{props.reply.users_name}</span>
                    <span className="display-date-comments">{pretty_print_date(props.reply.date)}</span>
                </div>
                <div className="comment-renderer">
                    {props.reply.comment}
                </div>
                <div className="like-reply-to-comment">
                    <div className="interact-element-styling-comments margin-right-comment-like-button">
                        <img id="like-dislike-comment" src={ liked ? activeLikeButton : notActiveLikeButton }
                        onClick={ () => like(setLiked, liked, user, setDisliked, disliked, likes, setLikes, props.video_title, 
                            props.commentKey, true, props.replyKey)}
                        />
                        { likes ? <span id="comment-likes">{likes}</span> : null }
                    </div>
                    <div className="interact-element-styling-comments">
                        <img id="like-dislike-comment" src={ disliked ? activeDislikeButton : notActiveDislikeButton }
                        onClick={ () => dislike(setLiked, liked, user, setDisliked, disliked, likes, setLikes, props.video_title, 
                            props.commentKey, true, props.replyKey)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReplyToComment