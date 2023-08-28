import Category from "./category";
import { profile_dropdown } from "../../utils/export-image-objects";
import { userContext } from "../../utils/contexts";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Logout (props) {

    const {user, setUser} = useContext(userContext) ; 
    const navigate = useNavigate() ; 

    const logout = () => {
        localStorage.removeItem("login-info") ; 
        setUser({logged_in : false})
        navigate("/") ; 
    }

    return (
        <div onClick={logout}>
            <Category 
            icon={profile_dropdown.logout_icon}
            text="Logout"
            />
        </div>
    )
}

export default Logout