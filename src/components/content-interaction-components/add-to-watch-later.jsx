import add_to from "../assets/add-to.svg"
import added from "../assets/check-mark.svg"
import { userContext } from "../utils/contexts"
import { useContext, useState, useEffect } from "react"
import "../../styles/play-video.css"
import {arrayRemove, arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore"
import { firestore } from "../firebase/firebase"

function AddToWatchLater (props) {

    const {user, setUser} = useContext(userContext) ; 
    const [inUsersWatchLater, setInUsersWatchLater] = useState(false)


    const addToWatchLater = async () => {
        if (!user.uid){alert("You must sign in or create an account to use this feature") ; return}
        setInUsersWatchLater(true)
        let user_doc = doc(firestore, "users", user.uid) ; 
        await updateDoc( user_doc, {
            "playlists.watch_later" : arrayUnion(props.title), 
        }) 
    }

    const removeFromWatchLater = async () => {
        let user_doc = doc(firestore, "users", user.uid) ; 
        setInUsersWatchLater(false)
        await updateDoc( user_doc, {
            "playlists.watch_later" : arrayRemove(props.title), 
        })
    }

    const check_if_added = async () => {
        if (!user.uid){return} 
        let user_doc = doc(firestore, "users", user.uid) ; 
        let watch_later_bucket = (await getDoc(user_doc)).data().playlists.watch_later ; 
        if (watch_later_bucket.includes(props.title)){
            setInUsersWatchLater(true) ; 
        } 
    }

    useEffect( () => {
        check_if_added() ; 
    }, [user])


    return (
        <div id="add-to-watch-later-container">
            <button id="add-to-watch-later-button" onClick={ inUsersWatchLater ? removeFromWatchLater : addToWatchLater}>
                <img id="watch-later-button-icon" src={ inUsersWatchLater ? added : add_to} alt="watch-later-icon"/>
                <span id="watch-later-text">Watch Later</span>
            </button>
        </div>
    )
}

export default AddToWatchLater