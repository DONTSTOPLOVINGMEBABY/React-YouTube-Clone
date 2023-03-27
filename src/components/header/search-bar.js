import { useEffect, useRef, useState, useContext } from "react"
import search_icon from "../assets/search-icon.svg"
import { firestore } from "../../firebase/firebase"
import {doc, getDocs, collection, getDoc, query, where} from "firebase/firestore"
import {userContext} from "../utils/contexts"
import { useNavigate } from "react-router-dom"
import SearchResult from "./search-bar-comps/search-result"
import { default_channels } from "../utils/common-server-calls"
const string_similarity = require("string-similarity"); 


function Search (props) {

    const search_input = useRef() ; 
    const [videoTitles, setVideoTitles] = useState() ; 
    const [channelNames, setChannelNames] = useState(false) ; 
    const [channelsAndVideos, setChannelsAndVideos] = useState(false) ; 
    const [serverTitleNames, setServerTitleNames] = useState(false) ; 
    const [searchResults, setSearchResults] = useState() ; 
    const {user, setUser} = useContext(userContext) ; 

    const [activateSearchBar, setActivateSearchBar] = useState(false) ;

    const navigate = useNavigate() ; 
        
    const handle_click_outside = (event) => {
        if (event.target.id != "search-input"){setActivateSearchBar(false)}
    }

    const handleInputClick = () => {
        setActivateSearchBar(true) ; 
    }

    const execute_search = (e) => {
        e.preventDefault() ; 
        console.log("Execute Search!") ;
        console.log(search_input.current.value) ; 
        
    }

    const update_search_results = async () => {
       if (!videoTitles || !channelNames){return} 
       const matches = string_similarity.findBestMatch(search_input.current.value, channelsAndVideos) ; 
       let scores = [] , scores_and_names = {}, results = [] ; 

       // Get all of the search results organized by rating

       Object.keys(matches["ratings"]).forEach( key => {
        if (scores_and_names[matches["ratings"][key]["rating"]]){
            scores_and_names[matches["ratings"][key]["rating"]].push(matches["ratings"][key]["target"])
            scores.push(matches["ratings"][key]["rating"]) 
        }
        else {
            scores_and_names[matches["ratings"][key]["rating"]] = [matches["ratings"][key]["target"]] ;
            scores.push(matches["ratings"][key]["rating"]) 
        }
       })

        // Build an arry of 14 of the highest results. 

        // Pretty sure this is quicksort 
        scores = scores.sort().reverse() ;
        let scores_set = new Set([...scores])
        
        scores_set.forEach( score => {
            if (results.length >= 14){return} ; 
            scores_and_names[score].forEach( name => {
                if (results.length <= 14){
                    results.push(name)
                }
            })
        })
        console.log(channelsAndVideos)
        setSearchResults(results) ; 
    }

    const getSearchInformation = async () => {

        let video_names = new Set() ; 
        let video_creators = new Set() ; 
        let server_title_names = {} ; 
        let video_collection = collection(firestore, "videos") ; 

        (await getDocs(video_collection)).docs.forEach( async (video) => {
            let video_name = video.id.split("_")[2].split(".")[0] ;  
            let video_creator = video.id.split("_")[1] ;  
            video_creators.add(video_creator) ; 
            video_names.add(video_name) ;

            if (server_title_names[video_name]){
                server_title_names[video_name] = [...server_title_names[video_name], video.id.replace(/_/g, '/')] ; 
            }
            else {
                server_title_names[video_name] = [video.id.replace(/_/g, '/')] 
            }
        }) 

        let video_creators_list = [...video_creators] ; 

        let translate_video_creators = await Promise.all( 
            video_creators_list.map( async (creator) => {
                if (default_channels.includes(creator)){return creator}
                return (await getDoc(doc(firestore, "users", creator))).data().channel_name 
            })
        )

        setVideoTitles([...video_names]) ; 
        setChannelNames([...translate_video_creators]) ; 
        setChannelsAndVideos([...video_names, ...translate_video_creators])
        setServerTitleNames(serverTitleNames) ;
    }


    const make_default_search_results = async () => {

        let initial_results = new Set(), past_searches = [], history = [], likes = [] ; 
        if (user){
            let user_doc = doc(firestore, "users", user.uid) ; 
            let user_info = (await getDoc(user_doc)).data() ; 
             
            past_searches = user_info.playlists.past_searches ; 
            history = user_info.playlists.history ; 
            likes = user_info.playlists.likes ; 
        }
        
        past_searches.forEach( (search) => {
            if (initial_results.size >= 14){return} ;  
            initial_results.add(search.split("_")[2].split(".")[0])
        })

        if (initial_results.size >= 14){}
        else {
            likes.forEach( (liked_video) => {
                if (initial_results.size >= 14){return} ;
                initial_results.add(liked_video.split("_")[2].split(".")[0])
            })
        }

        if (initial_results.size >= 14){}
        else {
            history.forEach( (video) => {
                if (initial_results.size >= 14){return} ;
                initial_results.add(video.split("_")[2].split(".")[0])
            })
        }

        if (initial_results.size >= 14){}
        else {
            while (initial_results.size < 14){
                let random_number = Math.floor(Math.random() * videoTitles.length) ; 
                if (!initial_results.has(videoTitles[random_number])){
                    initial_results.add(videoTitles[random_number])
                }
            }
        }
        setSearchResults([...initial_results])
    }

    const click_search_result = (text) => {
        search_input.current.value = text ; 
    }


    useEffect( () => {
        getSearchInformation(); 
    }, [])

    useEffect( () => {
        if (videoTitles && channelNames){
            make_default_search_results() ; 
        }
    }, [videoTitles, channelNames])

    useEffect( () => {
        document.addEventListener( 'click', handle_click_outside ) ; 
        return () => { document.removeEventListener('click', handle_click_outside) }
    }, [])



    // start with the video titles and channel names

    return ( 
        <div className="search-container">
            <form className="search" onSubmit={execute_search}>
                <input id="search-input"
                ref={search_input} 
                type="text"
                placeholder="Search"
                autoComplete="off"
                onChange={update_search_results}
                onClick={handleInputClick}
                /> 
                { activateSearchBar ? <div id="search-drop-down">
                    {searchResults.map( (result) => {
                        return (
                        <SearchResult title={result} key={result} 
                        click={click_search_result}  />
                        ) 
                    })}
                </div> : null } 
            </form> 
            <button onClick={execute_search} className="search-icon-container">
                    <img id="search-icon" src={search_icon} alt="search-icon"/>
            </button>
        </div>
    ) 
}

export default Search