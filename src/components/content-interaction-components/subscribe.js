import {doc, updateDoc, arrayRemove, arrayUnion} from "@firebase/firestore"
import { useEffect, useState, useContext } from "react"
import { firestore } from "../../firebase/firebase"
import { userContext } from "../utils/contexts";



function Subscribe (props) {


    const [subscribed, setSubscribed] = useState() ;
    const {user, setUser} = useContext(userContext) ; 

    const check_if_subscribed = async () => {
        if (user.subscribers){
            if (user.subscribers.includes(props.current_channel)){setSubscribed(true)}
            else {setSubscribed(false)}
        }
        console.log("hi")
    }

    const subscribe = async () => {
        if (!user.uid){alert("You must sign in or create an account to use this feature") ; return}
        const user_subscribers = user.subscribers ; 
        user_subscribers.push(props.current_channel) ;
        setUser({...user, user_subscribers})
        const user_ref = doc(firestore, "users", user.uid) ; 
        await updateDoc( user_ref, {
            "playlists.subscriptions" : arrayUnion(props.current_channel)
        }) 
    }

    const unsubscribe = async () => {
        const user_subscribers = user.subscribers ; 
        const index = user_subscribers.indexOf(props.current_channel) ;
        user_subscribers.splice(index, 1) ;  
        setUser({...user, subscribers: user_subscribers})
        const user_ref = doc(firestore, "users", user.uid) ; 
        await updateDoc( user_ref, {
            "playlists.subscriptions" : arrayRemove(props.current_channel)
        }) 
    }

    useEffect( () => {
        check_if_subscribed();
    }, [user])

    useEffect( () => {
        if (user.subscribers) {
        const index = user.subscribers.indexOf("Dope House") ;
        user.subscribers.splice(index, 1) ;  
    }
    }, [])
    
    return (
        <div id={props.id}>
            { subscribed ? 
            <>
            <button onClick={unsubscribe} className="subscribe-button" id="subscribed-button">
            Subscribed
            </button>
            </> 
            :
            <><button onClick={subscribe} className="subscribe-button" id="subscribe-button">
            Subscribe
            </button>
            </> 
            }            
        </div>
    )
}

export default Subscribe