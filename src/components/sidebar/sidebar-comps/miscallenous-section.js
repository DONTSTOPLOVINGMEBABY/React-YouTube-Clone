import Category from "./category";
import { miscallenous_sidebar_images } from "../../utils/export-image-objects";
import { useNavigate } from "react-router-dom";

function AboutCategory () {

    const navigate = useNavigate() ; 

    const about_page = () => { navigate("/about") }

    return (
        <div>
            <Category 
            icon={miscallenous_sidebar_images.about_icon}
            text="About"
            click={about_page}
            />
        </div>
    )
}

export {AboutCategory}