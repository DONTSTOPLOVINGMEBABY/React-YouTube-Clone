import Category from "./category";
import { miscallenous_sidebar_images } from "../../utils/export-image-objects";

function AboutCategory () {
    return (
        <div>
            <Category 
            icon={miscallenous_sidebar_images.about_icon}
            text="About"
            />
        </div>
    )
}

export {AboutCategory}