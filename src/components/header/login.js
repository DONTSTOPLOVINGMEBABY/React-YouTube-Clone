import profile_svg from "../assets/login-profile.svg" ; 
import { useContext, useRef, useState } from "react" ; 
import { userContext } from "../utils/contexts" ; 
import { auth, firestore } from "../../firebase/firebase";
import { GithubAuthProvider, signInWithPopup } from "@firebase/auth";
import {collection, setDoc, doc, query, where, getDocs} from "@firebase/firestore" ; 



const make_first_time_user = (channel_name, first, last, uid, profile_url = profile_svg) => {
    return {
        uid : uid, 
        first_name: first, 
        last_name: last, 
        channel_name: channel_name, 
        avatar: profile_url, 
        subscribers : 0, 
        total_channel_views: 0, 
        playlists: {
            watch_later: [], 
            favorites: [], 
            likes: [], 
            dislikes: [], 
            history: [], 
            subscriptions: [
                "Cinematic Masterpiece", 
                "Dope House", 
                "Everything Planes", 
                "House of Memes", 
                "Meditation Zone", 
                "Meditative Music", 
                "Meme Powerhouse", 
                "Tranquil Scenes", 
            ], 
            uploads: [], 
            past_searches: [], 
        }
    }
}


function Login () {

    const {user, setUser} = useContext(userContext)
    const [modal, setModal] = useState(false) ; 
    const channel_name = useRef() ; 
    const [checkBox, setCheckBox] = useState(false) ; 
    const [firstName, setFirstName] = useState() ; 
    const [lastName, setLastName] = useState() ; 

    const toggle_modal = () => setModal(!modal) ; 
    const toggle_checkbox = () => setCheckBox(!checkBox)

    const users_collection = collection(firestore, "users") ; 

    const loginFunction = async (e) => {
        e.preventDefault() ; 
        const channel_query = query(users_collection, where("channel_name", "==", `${channel_name.current.value}`))
        const querySnapshot = await getDocs(channel_query) ; 
        if (querySnapshot.size != 0) {alert("Channel name already taken") ; return}
        await setDoc( doc(firestore, "users", user.uid), make_first_time_user(
            channel_name.current.value, firstName, lastName, user.uid, user.profile_url
        ))
        const update_user_login_information = {...user, logged_in : true, channel_name : channel_name.current.value, first_name : firstName, last_name : lastName}
        setUser(update_user_login_information) ; 
        toggle_modal() ; 
        setUser(update_user_login_information) ;  
        localStorage.setItem("login-info", JSON.stringify(update_user_login_information)) ; 
    }

    const primary_login_function = async () => {
        let provider =  new GithubAuthProvider() ; 
        try {
            const sign_in = await signInWithPopup(auth, provider) ; 
            let first, last ; 
            if (sign_in.user.displayName){
                [first, last] = sign_in.user.displayName.split(" ") 
            }
            let uid = sign_in.user.uid ; 
            let avatar = sign_in.user.photoURL ; 
            const check_if_account_exists = query(users_collection, where("uid", "==", `${uid}`))
            const exists_snapshot = await getDocs(check_if_account_exists) ; 
            if (exists_snapshot.size == 0) {
                const update_user_login_information = {
                    logged_in : false, 
                    uid : uid, 
                    profile_url: avatar,   
                }
                setUser(update_user_login_information) ; 
                toggle_modal () ; 
            }
            else {
                first = exists_snapshot.docs[0].data().first_name ; 
                last = exists_snapshot.docs[0].data().last_name ; 
                const update_user_login_information = {
                    logged_in : true, 
                    uid : uid, 
                    profile_url: avatar, 
                    channel_name: exists_snapshot.docs[0].data().channel_name,  
                    first_name : first, 
                    last_name : last, 
                }
                setUser(update_user_login_information) ; 
                localStorage.setItem("login-info", JSON.stringify(update_user_login_information)) ; 
            }
        } catch (error) {
            alert("failed to login via github") ;
            console.log(error)
        }
    }

    return (
        <div className="login-primary">
            <button onClick={primary_login_function} className="login">
                <img id="profile-svg" src={profile_svg} alt="profile-svg"/>
                <div id="sign-in-text">Sign In</div>
            </button>
            { modal ? 
                <>
                <div className="modal-overlay">
                    <div className="modal-content">
                        
                        <form className="finish-setting-up" onSubmit={loginFunction}>
                            <div className="modal-title">Finish Setting Up Your Account!</div>
                            <div id="finish-setting-up-hold-form-inputs">
                                <div className="finish-setting-up-left">
                                    <label htmlFor="channel-name">Channel Name</label>
                                    <label htmlFor="signup-first-name">First Name</label>
                                    <label htmlFor="signup-last-name">Last Name</label>
                                </div>
                                <div className="finish-setting-up-right">
                                    <input type="text" id="channel-name" ref={channel_name} required/>
                                    <input type="text" id="signup-first-name" onChange={(e) => setFirstName(e.target.value)} required/>
                                    <input type="text" id="signup-last-name" onChange={(e) => setLastName(e.target.value)} required/>
                                </div>
                            </div>
                            <div className="modal-form-cell-1">
                                <input type="checkbox" 
                                id="agreement-statement" 
                                checked={checkBox} 
                                onChange={toggle_checkbox} 
                                required/>
                                <label htmlFor="agreement-statement" id="agreement">By checking this box, you agree to upload ONLY
                                copyright-free content and also agree that you will not upload pornography, graphic material, 
                                violence, or slander on this platform.</label>
                            </div>
                            <button id="create-account-button" type="submit">Create Account</button>
                        </form>
                    </div>
                </div>    
                </> 
            : null
            }
        </div>
    )
}

// Login is the default, 
// Or create an account with github
// it's either login or github 

export default Login