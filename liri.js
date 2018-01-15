require("dotenv").config();

// Import the keys.js file
var keys = require("keys.js");

// Get my keys:
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

console.log(spotify);