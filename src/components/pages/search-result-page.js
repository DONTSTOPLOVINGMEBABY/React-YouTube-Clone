import "../../styles/header.css"
import { useLocation } from "react-router-dom";

function SearchResultsPage(props) {

    const location = useLocation() ; 

    return (
        <div className="HomePage">
            Hello there
        </div>
    )

}

export default SearchResultsPage