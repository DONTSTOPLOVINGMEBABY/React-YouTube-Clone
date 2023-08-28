import {BrowserRouter, Routes, Route, HashRouter} from "react-router-dom" ;
import Header from "./components/header/header";
import HomePage from "./components/pages/HomePage";
import SideBar from "./components/sidebar/signed-in-sidebar";
import MiniSideBar from "./components/sidebar/mini-sidebar";
import SignedOutSideBar from "./components/sidebar/signed-out-sidebar";
import PlayVideo from "./components/pages/VideoPlayer";
import ChannelPage from "./components/pages/channel_page";
import UploadAVideo from "./components/pages/upload-a-video";
import LoadViewingHistory from "./components/pages/profile-related-pages/history";
import LoadLikedVideos from "./components/pages/profile-related-pages/liked-videos";
import LoadWatchLater from "./components/pages/profile-related-pages/watch-later";
import ShowSubscriptions from "./components/pages/Subscriptions-Page";
import AboutFakeYouTube from "./components/pages/About";
import SearchResultsPage from "./components/pages/search-result-page";
import {UserUploads, MusicUploads, MemesUploads, NatureUploads, PlanesUploads} from "./components/pages/Category-Components";
import { useEffect, useMemo, useState } from "react";
import { userContext } from "./components/utils/contexts";
import './styles/App.css';

const RouteSwitch = () => {

    const [user, setUser] = useState({
        logged_in : false, 
        first_name : null, 
        last_name : null, 
        profile_url : null, 
        uid : null, 
        channel_name: null, 
    }) ; 
    const userValue = useMemo(() => ({user, setUser}), [user, setUser])

    useEffect( () => {
        const data = localStorage.getItem("login-info") ; 
        if (data) {setUser(JSON.parse(data))} ; 
    }, [])

    return (
        <HashRouter>
            <userContext.Provider value={userValue}>
                <Header />
                <div className="simple"> 
                    { user.logged_in ? 
                    <> <SideBar/> <MiniSideBar/> </> : 
                    <> <SignedOutSideBar /> <MiniSideBar /> </>
                    }
                    <Routes>
                        <Route exact path="/" element={<HomePage/>}/>
                        <Route exact path="/video-player/:id" element={<PlayVideo/>}/>
                        <Route exact path="/individual-channel/:id" element={<ChannelPage/>}/>
                        <Route exact path="/upload-video" element={<UploadAVideo/>}/>
                        <Route exact path="/channel-page/:id" element={<ChannelPage/>}/>
                        {user ? <Route exact path="/viewing-history" element={<LoadViewingHistory/>}/> : null } 
                        {user ? <Route exact path="/liked-videos" element={<LoadLikedVideos/>}/> : null } 
                        {user ? <Route exact path="/watch-later" element={<LoadWatchLater/>}/> : null }
                        {user ? <Route exact path="/subscriptions" element={<ShowSubscriptions/>}/> : null }
                        {user ? <Route exact path="/user-uploads" element={<UserUploads/>}/> : null }
                        {user ? <Route exact path="/music-uploads" element={<MusicUploads/>}/> : null }
                        {user ? <Route exact path="/memes-uploads" element={<MemesUploads/>}/> : null }
                        {user ? <Route exact path="/nature-uploads" element={<NatureUploads/>}/> : null }
                        {user ? <Route exact path="/plane-uploads" element={<PlanesUploads/>}/> : null }
                        {user ? <Route exact path="/about" element={<AboutFakeYouTube/>}/> : null }
                        <Route exact path="/show-results/:id" element={<SearchResultsPage/>}/>
                    </Routes>
                </div>
            </userContext.Provider>
        </HashRouter>
    )
}

export default RouteSwitch 