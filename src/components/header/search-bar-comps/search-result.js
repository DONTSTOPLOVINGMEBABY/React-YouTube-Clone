import "../../../styles/header.css"
import { useLocation } from "react-router-dom"

function SearchResult (props) {

    const location = useLocation() ; 
    // console.log(location) ; 


    return (
        <div className="search-result" onClick={() => props.click(props.title)}>
            <span className="search-result-title">{props.title}</span>
        </div>
    )

}

export default SearchResult