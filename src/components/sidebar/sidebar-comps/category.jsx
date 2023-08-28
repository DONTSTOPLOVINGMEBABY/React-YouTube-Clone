function Category (props) {
    return (
        <div onClick={props.click} className="category">
            <img className="sidebar-icon" src={props.icon} alt="category-icon"/>
            <div className="sidetext">{props.text}</div>
        </div>
    )
}

export default Category