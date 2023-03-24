import "../../styles/App.css"

function AboutFakeYouTube() {
    return (
        <div className="HomePage about-fake-youtube">
            <h1 id="about-fake-youtube-title">Fake YouTube</h1>
            <span id="about-fake-youtube-text">
                Fake YouTube is a React YouTube clone that I developed as part of The Odin Project Curriculum.
                The prompt of the project was to create your favorite website using React and Firebase, with the
                goal being to achieve around 80% functionality of the original site. Many of the projects
                created by other students involved some type of realtime component such as a twitter feed or a 
                chat app, but I noticed that none featured the ability to show video. Wanting to stand out, I
                decided to take a stab at YouTube. 
                <br/>
                <br/>
                This YouTube clone has all of the basic components of a CRUD App: 
                <ul>
                    <li>Users can create comments or Upload Video Content.</li>
                    <li>Users can watch videos, read comments, and see video views and likes</li>
                    <li>Users update content through interaction such as video views</li>
                    <li>Users have the ability to delete videos or comments</li>
                </ul>
                Overall, I'm pleased with how the application turned out given where I was in my journey as a 
                developer. 
                <a href="https://github.com/DONTSTOPLOVINGMEBABY/Fake-YouTube">This application is on GitHub 
                and can be viewed here.</a> Feel free to clone, fork, and change in anyway you see fit!
            </span>
        </div>
    )
}

export default AboutFakeYouTube