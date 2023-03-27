import "../../../styles/header.css"

function SearchResult (props) {

    return (
        <div className="search-result" onClick={() => props.click(props.title)}>
            <span className="search-result-title">{props.title}</span>
        </div>
    )

}

export default SearchResult