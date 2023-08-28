import Category from "./category";
import { category_sidebar_images } from "../../utils/export-image-objects";
import { useNavigate } from "react-router-dom";

function ExploreCategories () {

    const navigate = useNavigate() ; 

    return (
        <div>
            <h3 className="sidebar-subtitle">Explore</h3>
            <Category 
            icon={category_sidebar_images.user_upload_icons}
            text="User Uploads"
            click={ ()  => navigate("/user-uploads")}
            />
            <Category 
            icon={category_sidebar_images.music_icon}
            text="Music"
            click={ () => navigate("/music-uploads")}
            /> 
            <Category 
            icon={category_sidebar_images.memes_icon}
            text="Memes"
            click={ () => navigate("/memes-uploads")} 
            />
            <Category 
            icon={category_sidebar_images.palm_tree_icon}
            text="Nature"
            click={ () => navigate("/nature-uploads")}
            />
            <Category 
            icon={category_sidebar_images.planes_icon}
            text="Planes"
            click={ () => navigate("/plane-uploads")}
            /> 
        </div>
    )
}

export {ExploreCategories} 
