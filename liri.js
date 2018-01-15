require("dotenv").config();

// Import the keys.js file
var keys = require("./keys.js");

// Get my Spotify keys:
// var spotify = new Spotify(keys.spotify);

// Require the twitter package
var Twitter = require('twitter');
// Get the twitter keys
var client = new Twitter(keys.twitter);
// Get the screen name"

var gBMahiliLiriAction = process.argv[2];

var gbmbLiri = {
    // Twitter Script:
    my_tweets : () => {
        // Get my last 20 tweets
        client.get('statuses/user_timeline', { q: 'barakamahili', count: 21 }, function (error, tweets, response) {
            tweets.forEach((element, index) => {
                console.log(`\n${index + 1}\nTweet Message: ${element.text}\nCreated at: ${element.created_at}\n------------------------------------`);
            });
            //console.log(tweets);  
        });
    }
};

switch (gBMahiliLiriAction) {
    case "my-tweets":
        gbmbLiri.my_tweets();
        break;

    default:
        break;
}
