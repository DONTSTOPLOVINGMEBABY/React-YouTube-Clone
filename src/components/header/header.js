import "../../styles/header.css"
import Search from "./search-bar"
import MainLogo from "./main-logo"
import Login from "./login"
import LoggedIn from "./logged-in"
import { useContext } from "react"
import { userContext } from "../utils/contexts"

function Header(props) {

    const {user, setUser} = useContext(userContext)



    return (
        <div className="header">
            <MainLogo/>
            <Search />
            { !user.logged_in ? <Login/> : <LoggedIn/>} 
        </div> 
    ) 
}

export default Header