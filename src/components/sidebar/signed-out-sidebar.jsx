import "../../styles/sidebar.css"
import Category from "./sidebar-comps/category"
import Login from "../header/login"
import {AboutCategory} from "./sidebar-comps/miscallenous-section"
import { ExploreCategories } from "./sidebar-comps/explore-categories-section"
import { GeneralNavSection } from "./sidebar-comps/general-nav-section"

export default function SignedOutSideBar () {
    return (
        <div className="signed-out-sidebar">
            <div className="general-nav-links">
                <GeneralNavSection/> 
            </div>
            <div className="sign-in-informational category-border">
                <div id="sign-in-message-sidebar">Sign in to like videos, comment, and subscribe.</div>
                <Login/>
            </div>
            <div className="display-categories category-border">
                <ExploreCategories/>
            </div>
            <div className="miscallenous-sidebar category-border">
                <AboutCategory/>
            </div>
        </div>
    )
}
