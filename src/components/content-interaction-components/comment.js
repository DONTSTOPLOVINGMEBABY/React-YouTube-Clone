import {doc, getDoc, collection, getDocs, updateDoc, increment, arrayRemove, arrayUnion, query, where} from "@firebase/firestore"
import { useEffect, useRef, useState, useContext } from "react";
import { firestore } from "../../firebase/firebase"
import { userContext } from "../utils/contexts";
import { like, dislike } from "./like-dislike-a-comment";
import ReplyToComment from "./reply-to-comment";
import "../../styles/play-video.css"
import notActiveLikeButton from "../assets/not-active-like.svg"
import notActiveDislikeButton from "../assets/not-active-dislike.svg"
import activeLikeButton from "../assets/active-like.svg"
import activeDislikeButton from "../assets/active-dislike.svg"
import downArrow from "../assets/down-arrow.svg" ; 
import upArrow from "../assets/up-arrow.svg" ; 

function Comments (props) {

    const [likes, setLikes] = useState(props.comment.likes)
    const [liked, setLiked] = useState(false) ; 
    const [disliked, setDisliked] = useState(false) ; 
    const [activeReply, setActiveReply] = useState(false) ; 
    const [activeInput, setActiveInput] = useState(false) ; 
    const [numberReplies, setNumberReplies] = useState(0) ; 
    const [replyPlural, setReplyPlural] = useState(false) ; 
    const [showReplies, setShowReplies] = useState(false) ; 
    const [holdReplies, setHoldReplies] = useState(props.comment.replies) ; 
    const {user, setUser} = useContext(userContext) ; 

    const replyInput = useRef() ; 

    const activate_comment_reply = () => {if (!activeReply) {setActiveReply(true)}}
    const deactive_comment_reply = () => {setActiveReply(false)} ; 
    const activate_replies = () => {setShowReplies(!showReplies)} ; 

    const check_if_liked_or_disliked = () => {
        if (props.comment.users_who_have_liked_this.includes(user.uid)){
            setLiked(true) ; 
        }
        if (props.comment.users_who_have_disliked_this.includes(user.uid)){
            setDisliked(true) 
        }
    }

    const pretty_print_date = (timestring) => {
        const date = new Date(timestring); 
        const day = ("0" + date.getDate()).slice(-2); 
        const month = ("0" + (date.getMonth() + 1)).slice(-2); 
        const year = date.getFullYear().toString().slice(-2); 
        return `${month}/${day}/${year}`;
    }

    const enter_reply = () => {
        let string = replyInput.current.value.trimStart() ; 
        if (string){setActiveInput(true)} 
        else {
            setActiveInput(false) ; 
            replyInput.current.value = '' ; 
        }
    }

    const make_reply = (userid, date, comment, avatar, name) => {
        return {
            uid : userid, 
            date : date, 
            comment : comment, 
            users_profile_id : avatar, 
            users_name : name, 
            users_who_have_liked_this : [], 
            users_who_have_disliked_this: [], 
            likes : 0, 
            dislikes : 0, 
        }
    }

    const reply_to_comment = async (comment_title_on_server) => {
        let now = new Date().getTime() ; 
        let reply_comment = make_reply(user.uid, now, 
            replyInput.current.value, user.profile_url, `${user.first_name} ${user.last_name}`)
        let comment_ref = doc(firestore, "videos", props.video_title) ; 
        let comment_doc2 = (await getDoc(comment_ref)).data()
        let comment_doc = comment_doc2.comments[`${props.commentKey}`].replies ; 
        console.log(comment_doc) ; 
        await updateDoc( comment_ref, {
            [`comments.${comment_title_on_server}.replies`] : {
                [`${user.uid}_${now}`] : reply_comment, 
                ...comment_doc, 
            }
        })
        
        setHoldReplies({...comment_doc, [`${user.uid}_${now}`] : reply_comment})

        setNumberReplies(numberReplies + 1) ; 
        replyInput.current.value = '' ; 
        setActiveInput(false) ; 
    }

    const check_number_of_replies = () => {
        let number_replies = Object.keys(holdReplies).length ; 
        setNumberReplies(number_replies) ; 
        if (number_replies > 1){setReplyPlural(true)}
    }

    useEffect( () => {
        check_if_liked_or_disliked() ; 
        check_number_of_replies() ; 
    }, [])

    
    return (
        <div className="individual-comment">
            <img id="comment-profile-avatar" src={props.comment.users_profile_id} alt="profile-picture"/>
            <div className="comments-likes-and-replies">
                <div className="name-and-date-comments">
                    <span className="display-name-comments">{props.comment.users_name}</span>
                    <span className="display-date-comments">{pretty_print_date(props.comment.date)}</span>
                </div>
                <div className="comment-renderer">
                    {props.comment.comment}
                </div>
                <div className="like-reply-to-comment">
                    <div className="interact-element-styling-comments margin-right-comment-like-button">
                        <img id="like-dislike-comment" src={ liked ? activeLikeButton : notActiveLikeButton }
                        onClick={ () => like(setLiked, liked, user, setDisliked, disliked, likes, setLikes, props.video_title, 
                            props.commentKey, false)}
                        />
                        <span id="comment-likes">{likes}</span>
                    </div>
                    <div className="interact-element-styling-comments">
                        <img id="like-dislike-comment" src={ disliked ? activeDislikeButton : notActiveDislikeButton }
                        onClick={ () => dislike(setLiked, liked, user, setDisliked, disliked, likes, setLikes, props.video_title, 
                            props.commentKey, false)}/>
                    </div>
                    <button onClick={activate_comment_reply} id="reply-to-comment-button">Reply</button>
                    {activeReply ? 
                        <div className="active-comment-reply">
                            <input id="comment-reply" type="text" ref={replyInput} onChange={enter_reply} 
                            placeholder="Leave a Reply..." autoComplete="off"/>
                            { activeInput ? <button onClick={ () => reply_to_comment(props.commentKey)} id="send-reply-to-comment">Comment</button> : 
                            <button onClick={deactive_comment_reply} id="cancel-reply-to-comment-button">Cancel</button>} 
                        </div> : null}
                </div>
                { numberReplies ? 
                <div className="comment-replies">
                    { !showReplies ? <button className="load-replies-button" onClick={activate_replies}>
                        <img className="load-replies-button-down-arrow" src={downArrow} alt="down-arrow"/>
                        {numberReplies} {replyPlural ? "replies" : "reply"} 
                    </button> : null }
                    { showReplies && Object.keys(holdReplies).map( (reply) => {
                        return <ReplyToComment key={reply} video_title={props.video_title}
                        replyKey={reply} reply={holdReplies[reply]} commentKey={props.commentKey}/>
                    })}
                     { showReplies ? <button className="load-replies-button" onClick={activate_replies}>
                        <img className="load-replies-button-down-arrow" src={upArrow} alt="down-arrow"/>
                        {numberReplies} {replyPlural ? "replies" : "reply"} 
                    </button> : null }
                </div>
                : null } 
            </div>
        </div>
    )
}

export default Comments

