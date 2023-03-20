import Category from "./category";
import { category_sidebar_images } from "../../utils/export-image-objects";

function ExploreCategories () {
    return (
        <div>
            <h3 className="sidebar-subtitle">Explore</h3>
            <Category 
            icon={category_sidebar_images.user_upload_icons}
            text="User Uploads"
            />
            <Category 
            icon={category_sidebar_images.music_icon}
            text="Music"
            /> 
            <Category 
            icon={category_sidebar_images.memes_icon}
            text="Memes"
            />
            <Category 
            icon={category_sidebar_images.palm_tree_icon}
            text="Nature"
            />
            <Category 
            icon={category_sidebar_images.planes_icon}
            text="Planes"
            /> 
        </div>
    )
}

export {ExploreCategories} 
