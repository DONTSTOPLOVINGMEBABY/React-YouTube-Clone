import { useNavigate } from "react-router-dom";
import Category from "./category";
import { general_nav_sidebar_images } from "../../utils/export-image-objects";

function GeneralNavSection () {

    const navigate = useNavigate() ;

    const navigate_home = () => {
        navigate("/") ; 
    }
    
    return (
        <div>
            <Category
            icon={general_nav_sidebar_images.home_icon}
            text="Home"
            click={navigate_home}
            />
            <Category
            icon={general_nav_sidebar_images.subscriptions_icon} 
            text="Subscriptions"
            />
        </div>
    )
}

export {GeneralNavSection} 