import {doc, getDoc, collection, getDocs, setDoc, updateDoc, increment, arrayRemove, arrayUnion, query, where} from "@firebase/firestore"
import {ref, uploadBytesResumable} from "@firebase/storage"
import { useRef, useState, useContext } from "react"
import {userContext} from "../utils/contexts" 
import { firestore, storage } from "../../firebase/firebase"
import "../../styles/upload-a-video.css"
import uploadIcon from "../assets/upload-image.svg" ; 
 
function UploadAVideo () {

    const [upload, setUpload] = useState(true) ; 
    const [videoFile, setVideoFile] = useState(false) ; 
    const [nameFile, setNameFile] = useState(false)
    const [other, setOther] = useState(false) ; 
    const [reviewFile, setReviewFile] = useState(false) ; 
    const [showPreview, setShowPreview] = useState(false) ; 
    const {user, setUser} = useContext(userContext) ; 
    const [successfulUpload, setSuccessfulUpload] = useState(false) ; 
     

    const file_input = useRef() ; 
    const file_input_image = useRef() ; 
    const click_input = () => {file_input.current.click()}
    const other_input = useRef() ; 
    const progress_fill = useRef() ; 
    const [progressText, setProgressText] = useState(0) ; 

    const videoTitleRef = useRef() ; 
    const [videoDescription, setVideoDescription] = useState(null)
    const [saveVideoTitle, setSaveVideoTitle] = useState(null) ; 
    const [saveVideoCategory, setSaveVideoCategory] = useState(null) ; 
    const videoCategoryRef = useRef() ; 

    const save_file_locally = () => {
        if (file_input.current.files[0].size > 31000000){
            alert("File must be smaller than 31 megabytes") ; 
            return ; 
        }
        setVideoFile(file_input.current.files[0]) ;   
        console.log(file_input.current.files[0]) 
        setUpload(false) ;      
        setNameFile(true) ; 
    }

    const check_for_other = () => {           
        if (videoCategoryRef.current.value == "Other"){setOther(true)}
        else {setOther(false)}
    }

    const check_title_input = () => {
        videoTitleRef.current.value = videoTitleRef.current.value.replace(/[_\/.]/g, '') ; 
    }

    const setTextarea = (e) => {
        setVideoDescription(e.target.value) ; 
    }

    const submitForm = (e) => {
        e.preventDefault() ; 
        if (videoCategoryRef.current.value == "Other"){setSaveVideoCategory(other_input.current.value)}
        else {setSaveVideoCategory(videoCategoryRef.current.value)}
        setSaveVideoTitle(videoTitleRef.current.value.trim()) ; 
        setNameFile(false) ; 
        setReviewFile(true) ; 
    }

    const pretty_print_date = (timestring) => {
        const date = new Date(timestring); 
        const day = ("0" + date.getDate()).slice(-2); 
        const month = ("0" + (date.getMonth() + 1)).slice(-2); 
        const year = date.getFullYear().toString().slice(-2); 
        return `${month}/${day}/${year}`;
    }

    const return_new_video_object = (category, description, title, upload_date ) => {
        return {
            category : category, 
            comments : {}, 
            creator : user.channel_name, 
            description : description, 
            dislikes : 0, 
            likes : 0, 
            title : title, 
            upload_date : pretty_print_date(upload_date), 
            view_count : 0, 
        }
    }

    const uploadVideo = async (e) => {
        setShowPreview(true) ; 
        setReviewFile(false) ; 
        
        let upload_ref = ref(storage, `Uploads/${user.uid}/${saveVideoTitle}.mp4`)
        const uploadTask = uploadBytesResumable(upload_ref, videoFile) ; 

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress_fill.current.style.width = `${progress}%` ; 
            setProgressText(Math.round(progress)) ; 
        })

        uploadTask.on('state_changed', (snapshot) => {
            if (((snapshot.bytesTransferred / snapshot.totalBytes) * 100) == 100){
                setSuccessfulUpload(true)
            }
        })

        let new_video_ref = doc(firestore, "videos", `Uploads_${user.uid}_${saveVideoTitle}.mp4`) ; 
        let user_ref = doc(firestore, "users", `${user.uid}`) ; 
        let today = new Date() ; 
        await setDoc(new_video_ref, return_new_video_object(saveVideoCategory, videoDescription, saveVideoTitle, today)) ; 
        await updateDoc( user_ref, {
            "playlists.uploads" : arrayUnion(`Uploads_${user.uid}_${saveVideoTitle}.mp4`), 
        })
    }
    



    return (
        <div className="HomePage UploadVideo">
            <div className="Upload-Main-Div">

                {upload ? <div className="Choose-File">
                    <img id="upload-icon" src={uploadIcon} alt="upload-icon" 
                    ref={file_input_image} onClick={click_input}/>
                    <input type="file" accept="video/mp4" id="file-input" ref={file_input} onChange={save_file_locally}/>
                    <h2 id="choose-a-file-title">Click on the Cloud or the Button Below and Choose Your Video! 
                    Only Mp4 format is accepted! The video must also be smaller than 30 megabytes. I will try to
                    integrate format version in the future!</h2>
                    { videoFile ? <button id="file-button">Upload</button> : 
                    <button onClick={click_input} id="file-button">Choose a File</button> } 
                </div> : null } 
                { nameFile ? 
                    <form id="upload-video-details" onSubmit={submitForm}>
                        <h2 id="upload-video-form-title">Edit Video Meta-Data</h2>
                        <div className="upload-form-cell">
                            <label id="upload-form-labels" htmlFor="upload-video-title-input">Video Title</label>
                            <input required type="text" id="upload-video-title-input" onChange={check_title_input} ref={videoTitleRef} placeholder="Video Title"/> 
                        </div>
                        <div className="upload-form-cell">
                            <label id="upload-form-labels" htmlFor="upload-video-description-input">Video Description</label>
                            <textarea required id="upload-video-description-input" onChange={setTextarea} placeholder="Enter-Description"/> 
                        </div>
                        <div className="upload-form-cell">
                            <label htmlFor="upload-video-category-input">Choose a category for your video</label>
                            <select required name="pets" id="upload-video-category-input" onChange={check_for_other} ref={videoCategoryRef}>
                                <option value="">Choose a category</option>
                                <option value="Music">Music</option>
                                <option value="Memes">Memes</option>
                                <option value="Nature">Nature</option>
                                <option value="Planes">Planes</option>
                                <option value="Other">Other</option>
                            </select>
                            { other ? <input ref={other_input} required type="text" id="upload-other-input" placeholder="Enter Video Category"/> : null }
                        </div>
                        <button type="submit" id="file-metadata-button">Finish Editing Video Details</button>
                    </form> : null }
                    { reviewFile ? 
                        <div id="review-video-before-upload">
                            <h2 id="upload-video-form-title">Review Video Before Upload</h2>
                            <div id="preview-video-before-submission">
                                <video id="preview-video" controls>
                                    <source src={URL.createObjectURL(videoFile)} type="video/mp4"/>
                                </video>
                            </div>
                            <div id="review-video-metadata">
                                <div className="review-metadata-cell"><span id="bold-metadata-topic">Video Title: </span> {saveVideoTitle}</div>
                                <div className="review-metadata-cell"><span id="bold-metadata-topic">Video Description: </span> {videoDescription}</div>
                                <div className="review-metadata-cell"><span id="bold-metadata-topic">Video Category: </span> {saveVideoCategory}
                      </div>
                            </div>
                            <div id="agreement-upload">By Uploading this video, you agree to not post copyrighted material, 
                            pornography, or any graphic content of the sort, and agree that YOU, the user, are responsible for
                            any potential civil or criminal liabilities associated with your uploads.</div>
                            <button id="upload-video-button" onClick={uploadVideo}>Upload Video to Fake Youtube!</button>
                        </div> 
                    : null}
                    { showPreview ? <div id="show-download-preview">
                        <h2 id="upload-video-form-title">Please Do Not Leave This Page While Your Video is Uploaded</h2>
                        <div id="progress-bar">
                             <div id="progress__fill" ref={progress_fill}></div>
                             <span id="progress__text">{progressText}%</span>
                        </div>
                        { successfulUpload ? <h2 id="upload-video-form-title">
                            Your Upload was Successful! You can view it on your Homepage!
                        </h2> : null }
                    </div> : null }

            </div>
        </div>
    )
}

export default UploadAVideo