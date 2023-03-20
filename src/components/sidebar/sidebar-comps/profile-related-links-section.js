import Category from "./category";
import { sidebar_profile_related_links_images } from "../../utils/export-image-objects";

function ProfileRelatedLinks () {
    return (
        <div>
            <Category 
                icon={sidebar_profile_related_links_images.history_icon}
                text="History"
                />
                <Category 
                icon={sidebar_profile_related_links_images.your_videos_icon}
                text="Your Videos"
                />
                <Category 
                icon={sidebar_profile_related_links_images.clock_icon}
                text="Watch Later"
                />
                <Category 
                icon={sidebar_profile_related_links_images.likes_icon}
                text="Liked Videos"
                />
        </div>
    )
}

export {ProfileRelatedLinks} 