require("dotenv").config();

// Import the keys.js file
var keys = require("./keys.js");

// Get my Spotify keys:
// var spotify = new Spotify(keys.spotify);

// Require the twitter package
var Twitter = require('twitter');
// Get the twitter keys
const client = new Twitter(keys.twitter);
const omdb_api_key = keys.omdb.omdb_api_key;
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
    },

    // OMDB
    movie_this :() => {
        // Require the request package
        var request = require("request");
        // Create the movie name from the user's input
        var movieName = process.argv[3]; 
        // Now, let's check if the user entered more than one word for the movie title
        // But First, let's find out how many arguments the user passed in
        var allArguments = process.argv;        
        // Then, we check if the arguments are already more than 4...
        // remember that process.argv already comes with 2 args, then when we add our app name, that's 3...and if a user types in the first word of the movie, that's the 4th already
        if (allArguments.length > 4) {
            // If there are more that 4 arfuments, means the user typed in more than one word of the movie...then we create our own movie name with the rest of the words
            for (let i = 4; i < allArguments.length; i++){
                movieName += "+" +allArguments[i];               
            }
        }

        // Let's also check if a user didn't type in anything. We will use a default movie name called 'Mr. Nobody' if a user does not provide one
        if (allArguments.length == 3) {
            movieName = "Mr.+Nobody";
        }
        //console.log(movieName);
        // Create the url    
        var url = `http://www.omdbapi.com/?apikey=${omdb_api_key}&t=${movieName}`;
        // Get the data using request
        request(url, (error, response, body) => {
            // Check if there is no error and the status code is 200, means OK
            if (!error && response.statusCode === 200) {
                // Get the movie infor text and change it into a JSON object
                var movieInfo = JSON.parse(body);
                // Create data to be shown
                var showMovieInfo = `
                        \n****************************************
                        \n HERE ARE THE RESULTS ABOUT YOUR MOVIE:
                        \n****************************************
                        \n* Title of the movie: ${movieInfo.Title}
                        \n* Year the movie came out: ${movieInfo.Year}
                        \n* IMDB Rating of the movie: ${movieInfo.Ratings[0].Value}
                        \n* Rotten Tomatoes Rating of the movie: ${movieInfo.Ratings[1].Value}
                        \n* Country where the movie was produced: ${movieInfo.Country}
                        \n* Language of the movie: ${movieInfo.Language}
                        \n* Plot of the movie: ${movieInfo.Plot}
                        \n* Actors in the movie: ${movieInfo.Actors}
                        \n****************************************
                `;
                // Log the data to the bash
                console.log(showMovieInfo);
            }
        });
    }
};

switch (gBMahiliLiriAction) {
    case "my-tweets":
        gbmbLiri.my_tweets();
        break;
    case "movie-this":
        gbmbLiri.movie_this();
        break;

    default:
        break;
}
