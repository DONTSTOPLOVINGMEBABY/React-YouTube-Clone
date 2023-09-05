# React-YouTube-Clone AKA Fake-YouTube

### [Fake-YouTube](https://henryjacobs.us/React-YouTube-Clone/) is a React YouTube clone that grants users much of the same functionality they would get on actual YouTube. 

Some of the things users can do on Fake-YouTube include :
- Uploading videos to their own channel
- Subscribing to other Fake-YouTube channels
- Watching user-uploaded content
- Interacting with user-uploaded content through likes and dislikes
- Commenting on User-Uploaded Content
- Customizing their channel's homepage.
- And many others! 

### How the site Functions

Fake-YouTube runs off of a free Firebase account that is limited to 30gb of video bandwidth a month. Firebase doesn't 
offer adaptive BitRate Streaming, so videos are expnesive to serve and the traffic to Fake-YouTube must be limited to 
a small number of users a month. As of right now, Fake-YouTube only utilizes Firebase Storage and Cloud Firestore to serve 
data, while the rest of processing required by Fake-YouTube happens in the browser. This means that all recommendation algorithms, 
sorting/searching routines, etc. are fairly straightforward. At some point in time, I intend to add more complexity through a 
dedicated backend or a serverless solution through something such as Firebase Functions. 

### Technologies Used

- React
- Firebase Cloud Firestore
- Firebase Storage

#### Disclaimer

*This application is stricly built for educational purposes, and is no way meant to be a competitor of YouTube.com.*
*All videos uploaded to this platform belong to their respective owners and/or are copyright free. The site is actively patrolled*
*for non-copyright/stolen content.*

The site is currently live on my personal site [here](https://henryjacobs.us/React-YouTube-Clone/) . 
