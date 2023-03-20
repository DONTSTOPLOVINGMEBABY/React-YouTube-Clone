import youtube_icon from "../assets/youtube-icon.svg"
import menu_icon from "../assets/menu.svg"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

function MainLogo () {
    
    const navigate = useNavigate() ;
    const [isActive, setIsActive] = useState(false) ; 
    const setActive = () => {setIsActive(!isActive)} ; 


    const return_home = () => { 
        navigate("/") ;  
    }

    const trigger_menu = () => {
        if (!isActive) {
            document.getElementsByClassName("sidebar")[0].style.display = "none" ; 
            document.getElementsByClassName("mini-sidebar")[0].style.display = "flex" ;
            setActive() ; 
        }
        else {
            document.getElementsByClassName("sidebar")[0].style.display = "block" ; 
            document.getElementsByClassName("mini-sidebar")[0].style.display = "none" ;
            setActive() ; 
        }
        console.log(isActive) ; 
    }
    
    return ( 
        <div className="main-logo">
            <img className="wrap-icon" onClick={trigger_menu} id="menu-icon" src={menu_icon} alt="menu-icon"/>
            <img id="youtube-icon" src={youtube_icon} onClick={return_home} alt="YouTube Icon"/> 
            <div id="youtube-text" onClick={return_home} >Fake-YouTube</div>
        </div> 
    )
}

export default MainLogo