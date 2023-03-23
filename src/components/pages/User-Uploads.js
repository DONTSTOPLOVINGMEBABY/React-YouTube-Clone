import { useEffect, useState } from "react"
import "../../styles/profile-related-pages.css"
import { firestore, storage } from "../../firebase/firebase"
import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import PreviewPlayer from "./video-components/preview-player"
import { query_with_category_and_search_paramater } from "../utils/common-server-calls"

function UserUploads () {

    const [videoNames, setVideoNames] = useState()
    const [namesAndLinks, setNamesAndLinks] = useState() 


    useEffect( () => {
        query_with_category_and_search_paramater("user_upload", true, setVideoNames, setNamesAndLinks) ; 
    }, [])

    return (
        <div className="HomePage categories-page">
            <h1 className="categories-title">User Uploads</h1>
            <div className="category-players">
            { namesAndLinks && videoNames.map( (name) => {
                console.log(name)
                return (
                <PreviewPlayer 
                className="home-page-player"
                main_container="video-container"
                video_class="video"
                video_information="video-information-main"
                profile_picture="profile-picture-main"
                profile_photo="profile-photo-homepage-player" 
                other_information="other-information-homepage"
                video_title="video-title-homepage"
                video_channel="channel-name-homepage"
                group="group-homepage"
                views="views-homepage"
                date="upload-date-homepage"
                play={false} 
                video={namesAndLinks[name]}
                title={name}
                key={name}
                />
            )
            })} 
            </div>
        </div>
    )
}

function MusicUploads ( ) {
    const [videoNames, setVideoNames] = useState()
    const [namesAndLinks, setNamesAndLinks] = useState() 


    useEffect( () => {
        query_with_category_and_search_paramater("category", "Music", setVideoNames, setNamesAndLinks) ; 
    }, [])

    return (
        <div className="HomePage categories-page">
            <h1 className="categories-title">Music Uploads</h1>
            <div className="category-players">
            { namesAndLinks && videoNames.map( (name) => {
                console.log(name)
                return (
                <PreviewPlayer 
                className="home-page-player"
                main_container="video-container"
                video_class="video"
                video_information="video-information-main"
                profile_picture="profile-picture-main"
                profile_photo="profile-photo-homepage-player" 
                other_information="other-information-homepage"
                video_title="video-title-homepage"
                video_channel="channel-name-homepage"
                group="group-homepage"
                views="views-homepage"
                date="upload-date-homepage"
                play={false} 
                video={namesAndLinks[name]}
                title={name}
                key={name}
                />
            )
            })} 
            </div>
        </div>
    )
}


function MemesUploads () {
    const [videoNames, setVideoNames] = useState()
    const [namesAndLinks, setNamesAndLinks] = useState() 


    useEffect( () => {
        query_with_category_and_search_paramater("category", "Memes", setVideoNames, setNamesAndLinks) ; 
    }, [])

    return (
        <div className="HomePage categories-page">
            <h1 className="categories-title">Memes Uploads</h1>
            <div className="category-players">
            { namesAndLinks && videoNames.map( (name) => {
                console.log(name)
                return (
                <PreviewPlayer 
                className="home-page-player"
                main_container="video-container"
                video_class="video"
                video_information="video-information-main"
                profile_picture="profile-picture-main"
                profile_photo="profile-photo-homepage-player" 
                other_information="other-information-homepage"
                video_title="video-title-homepage"
                video_channel="channel-name-homepage"
                group="group-homepage"
                views="views-homepage"
                date="upload-date-homepage"
                play={false} 
                video={namesAndLinks[name]}
                title={name}
                key={name}
                />
            )
            })} 
            </div>
        </div>
    )

}


function NatureUploads () {
    const [videoNames, setVideoNames] = useState()
    const [namesAndLinks, setNamesAndLinks] = useState() 


    useEffect( () => {
        query_with_category_and_search_paramater("category", "Nature", setVideoNames, setNamesAndLinks) ; 
    }, [])

    return (
        <div className="HomePage categories-page">
            <h1 className="categories-title">Nature Uploads</h1>
            <div className="category-players">
            { namesAndLinks && videoNames.map( (name) => {
                console.log(name)
                return (
                <PreviewPlayer 
                className="home-page-player"
                main_container="video-container"
                video_class="video"
                video_information="video-information-main"
                profile_picture="profile-picture-main"
                profile_photo="profile-photo-homepage-player" 
                other_information="other-information-homepage"
                video_title="video-title-homepage"
                video_channel="channel-name-homepage"
                group="group-homepage"
                views="views-homepage"
                date="upload-date-homepage"
                play={false} 
                video={namesAndLinks[name]}
                title={name}
                key={name}
                />
            )
            })} 
            </div>
        </div>
    )

}

function PlanesUploads () {
    const [videoNames, setVideoNames] = useState()
    const [namesAndLinks, setNamesAndLinks] = useState() 

    useEffect( () => {
        query_with_category_and_search_paramater("category", "Planes", setVideoNames, setNamesAndLinks) ; 
    }, [])

    return (
        <div className="HomePage categories-page">
            <h1 className="categories-title">Category Uploads</h1>
            <div className="category-players">
            { namesAndLinks && videoNames.map( (name) => {
                console.log(name)
                return (
                <PreviewPlayer 
                className="home-page-player"
                main_container="video-container"
                video_class="video"
                video_information="video-information-main"
                profile_picture="profile-picture-main"
                profile_photo="profile-photo-homepage-player" 
                other_information="other-information-homepage"
                video_title="video-title-homepage"
                video_channel="channel-name-homepage"
                group="group-homepage"
                views="views-homepage"
                date="upload-date-homepage"
                play={false} 
                video={namesAndLinks[name]}
                title={name}
                key={name}
                />
            )
            })} 
            </div>
        </div>
    )

}


export {
    UserUploads, 
    MusicUploads, 
    MemesUploads,
    NatureUploads, 
    PlanesUploads, 
}
