import Category from "./category";
import { general_nav_sidebar_images } from "../../utils/export-image-objects";

function GeneralNavSection () {
    return (
        <div>
            <Category 
            icon={general_nav_sidebar_images.home_icon}
            text="Home"
            />
            <Category
            icon={general_nav_sidebar_images.subscriptions_icon} 
            text="Subscriptions"
            />
        </div>
    )
}

export {GeneralNavSection} 