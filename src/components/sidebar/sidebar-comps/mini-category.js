
function MiniCategory (props) {
    return (
        <div className="mini-category">
           <img className="mini-category-icon" src={props.icon} alt="mini-category-icon" /> 
           <div className="mini-cat-text">{props.text}</div>
        </div>
    )
}

export default MiniCategory ; 