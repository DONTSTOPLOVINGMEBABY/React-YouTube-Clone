import { useEffect, useRef, useState } from "react"
import search_icon from "../assets/search-icon.svg"
import { firestore } from "../../firebase/firebase"
import {doc, getDocs, collection, query, where} from "firebase/firestore"
const string_similarity = require("string-similarity"); 


function Search (props) {

    const search_input = useRef() ; 
    const [videoTitles, setVideoTitles] = useState() ; 
    const [channelNames, setChannelNames] = useState() ; 
    const [channelsAndVideos, setChannelsAndVideos] = useState() ; 
    const [searchResults, setSearchResults] = useState() ; 


    const execute_search = (e) => {
        e.preventDefault() ; 
        console.log("Execute Search!") ;
        console.log(search_input.current.value) ; 
        
    }

    // const update_search_results = async () => {
    //    if (!videoTitles || !channelNames){return} 
    //    const matches = string_similarity.findBestMatch(search_input.current.value, channelsAndVideos) ; 
    //    let scores = [] , scores_and_names = {}, results = [] ; 

    //    // Get all of the search results organized by rating

    //    Object.keys(matches["ratings"]).forEach( key => {
    //     if (scores_and_names[matches["ratings"][key]["rating"]]){
    //         scores_and_names[matches["ratings"][key]["rating"]].push(matches["ratings"][key]["target"])
    //         scores.push(matches["ratings"][key]["rating"]) 
    //     }
    //     else {
    //         scores_and_names[matches["ratings"][key]["rating"]] = [matches["ratings"][key]["target"]] ;
    //         scores.push(matches["ratings"][key]["rating"]) 
    //     }
    //    })

    //     // Build an arry of 14 of the highest results. 

    //     scores = scores.sort().reverse() ;
    //     let scores_set = new Set([...scores])
        
    //     scores_set.forEach( score => {
    //         if (results.length >= 14){return} ; 
    //         scores_and_names[score].forEach( name => {
    //             if (results.length <= 14){
    //                 results.push(name)
    //             }
    //         })
    //     })

    //     setSearchResults(results) 
    // }

    // const getSearchInformation = async () => {
    //     let video_names = new Set() ; 
    //     let video_creators = new Set() ; 
    //     let video_collection = collection(firestore, "videos") ; 
    //     (await getDocs(video_collection)).docs.forEach( (video) => {
    //         video_creators.add(video.id.split("_")[1]) ; 
    //         video_names.add(video.id.split("_")[2].split(".")[0]) ; 
    //     }) ;
    //     setVideoTitles(...video_names) ; 
    //     setChannelNames(...video_creators) ; 
    //     setChannelsAndVideos([...video_names, ...video_creators])
    // }

    // useEffect( () => {
    //     getSearchInformation(); 
    // }, [])


    // start with the video titles and channel names

    const update_search_results = () => {return}



    return ( 
        <div className="search-container">
            <form className="search" onSubmit={execute_search}>
                <input id="search-input"
                ref={search_input} 
                type="text"
                placeholder="Search"
                autoComplete="off"
                onChange={update_search_results}
                /> 
            </form> 
            <button onClick={execute_search} className="search-icon-container">
                    <img id="search-icon" src={search_icon} alt="search-icon"/>
            </button>
        </div>
    ) 
}

export default Search