import { useRef } from "react"
import search_icon from "../assets/search-icon.svg"

function Search (props) {

    const search_input = useRef() ; 


    const execute_search = (e) => {
        e.preventDefault() ; 
        console.log("Execute Search!") ;
        console.log(search_input.current.value)
    }

    return ( 
        <div className="search-container">
            <form className="search" onSubmit={execute_search}>
                <input id="search-input"
                ref={search_input} 
                type="text"
                placeholder="Search"
                autoComplete="off"
                /> 
            </form> 
            <button onClick={execute_search} className="search-icon-container">
                    <img id="search-icon" src={search_icon} alt="search-icon"/>
            </button>
        </div>
    ) 
}

export default Search