This is a NodeJS backend server for the twitter blockchain app.

#Features 
 1. You can repost a tweet and donate ether to the original poster 
 2. You can donate ether to a hashtag which will eventually go to a particular address(example charity)


#Technical Features 
 1. Uses clustering to improve performance
 2. Uses redis to cache frequent requests
 3. Uses Cloudinary CDN for media
 4. Truffle with Infura for deploying contracts
 5. Web3 to communicate with contracts
 6. Winston for loggin 
 7. Node-Cron to expire funds donated to a hashtag+ 
 8. Works internationally, handles every timezone. So an expiry date set by a person in EST takes effect 
    in EST time.