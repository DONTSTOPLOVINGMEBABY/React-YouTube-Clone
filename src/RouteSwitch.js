import {BrowserRouter, Routes, Route, HashRouter} from "react-router-dom" ;
import Header from "./components/header/header";
import HomePage from "./components/pages/HomePage";
import SideBar from "./components/sidebar/signed-in-sidebar";
import MiniSideBar from "./components/sidebar/mini-sidebar";
import SignedOutSideBar from "./components/sidebar/signed-out-sidebar";
import PlayVideo from "./components/pages/VideoPlayer";
import ChannelPage from "./components/pages/channel_page";
import UploadAVideo from "./components/pages/upload-a-video";
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
                    </Routes>
                </div>
            </userContext.Provider>
        </HashRouter>
    )
}

export default RouteSwitch 