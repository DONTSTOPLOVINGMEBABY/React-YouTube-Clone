import { mini_sidebar_icons } from "../utils/export-image-objects"
import MiniCategory from "./sidebar-comps/mini-category"

function MiniSideBar () {
    return (
        <div className="mini-sidebar">
            <MiniCategory 
            icon={mini_sidebar_icons.home_icon}
            text="Home"
            />
            <MiniCategory 
            icon={mini_sidebar_icons.subscriptions_icon}
            text="Subscriptions"
            />
            <MiniCategory 
            icon={mini_sidebar_icons.profile_icon}
            text="Profile"
            />
            <MiniCategory 
            icon={mini_sidebar_icons.about_icon}
            text="About"
            />
        </div>
    )
}

// Home 
// All Subscriptions
// Profile
// About

export default MiniSideBar