require("dotenv").config();

// Import ALL the keys from the keys.js file
const keys = require("./keys.js");

// Required Spotify
const Spotify = require('node-spotify-api');
// Get my Spotify keys:
const spotify = new Spotify(keys.spotify);

// Require the twitter package
const Twitter = require('twitter');
// Get my Twitter keys
const client = new Twitter(keys.twitter);

// Get the OMDAPI keys
const omdb_api_key = keys.omdb.omdb_api_key;

// Let's create the action that will be used in the terminal...we will use ('my-tweets', 'movie-this', 'spotify-this-song', 'do-what-it-says'). Check the switch function for usage
const gBMahiliLiriAction = process.argv[2];

// Let's create an object that store out methods to call when we call each of the above actions:
var gbmbLiri = {
    // Let's create a query that will be used in the whole app:
    createQuery : () => {
        // Create the query name from the user's input
        query = process.argv[3];
        // Now, let's check if the user entered more than one word for the query title
        // But First, let's find out how many arguments the user passed in
        allArguments = process.argv;
        // Then, we check if the arguments are already more than 4...
        // remember that process.argv already comes with 2 args, then when we add our app name, that's 3...and if a user types in the first word of the query, that's the 4th already
        if (allArguments.length > 4) {
            // If there are more that 4 arfuments, means the user typed in more than one word of the query...then we create our own query name with the rest of the words
            for (let i = 4; i < allArguments.length; i++) {
                query += "+" + allArguments[i];
            }
        }
    },
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
    movie_this: (altQuery) => {
        // Require the request package
        var request = require("request");
        // Call the createQuery method to create the query
        gbmbLiri.createQuery();
        
        // Let's also check if a user didn't type in anything. We will use a default movie name called 'Mr. Nobody' if a user does not provide one
        if (allArguments.length == 3) {
            query = "Mr.+Nobody";
        }
        // Also, we are checking if an altQuery was passed in our function, if it was passed in, then we use it as our query. 
        // This will be useful when calling the do-what-it-says query
        if (typeof altQuery !== 'undefined') {
            query = altQuery;
        }
        // Create the url    
        var url = `http://www.omdbapi.com/?apikey=${omdb_api_key}&t=${query}`;
        // Get the data using request
        request(url, (error, response, body) => {
            // Check if there is no error and the status code is 200, means OK
            if (!error && response.statusCode === 200) {
                // Get the movie infor text and change it into a JSON object
                var movieInfo = JSON.parse(body);
                // Create data to be shown
                var showMovieInfo = `
                        |----------------------------------------|
                        -HERE ARE THE RESULTS ABOUT YOUR MOVIE:-
                        |----------------------------------------|
                        * Title of the movie: ${movieInfo.Title}
                        * Year the movie came out: ${movieInfo.Year}
                        * IMDB Rating of the movie: ${movieInfo.Ratings[0].Value}
                        * Rotten Tomatoes Rating of the movie: ${movieInfo.Ratings[1].Value}
                        * Country where the movie was produced: ${movieInfo.Country}
                        * Language of the movie: ${movieInfo.Language}
                        * Plot of the movie: ${movieInfo.Plot}
                        * Actors in the movie: ${movieInfo.Actors}
                        |----------------------------------------|
                `;
                // Log the data to the bash
                console.log(showMovieInfo);
            }
        });
    },

    // Songs from spotify
    spotify_this_song : (altQuery) => {        
        // Get the search word
        gbmbLiri.createQuery();
        // Check if more than 3 arfuments were provided
        if (allArguments.length == 3) {
            query = "The Sign by Ace of Base";
        }
        // Also, we are checking if an altQuery was passed in our function, if it was passed in, then we use it as our query. 
        // This will be useful when calling the do-what-it-says query
        if (typeof altQuery !== 'undefined') {
            query = altQuery;
        }        
        // Call the spotify search method
        spotify.search({ type: 'track', query: query, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // Let's create the needed info to display using the data retrieved from Spotify:
            var displaySong = `
                |----------------------------------------|
                |-HERE ARE THE RESULTS ABOUT YOUR SONG:--|
                |----------------------------------------|
                | Artist(s): ${data.tracks.items[0].album.artists[0].name}
                | Song's name: ${data.tracks.items[0].name}
                | Preview Link: ${data.tracks.items[0].preview_url}
                | Album Name: ${data.tracks.items[0].album.name}
                |----------------------------------------|
            `;
            console.log(displaySong);
        });  
    },

    // do_what_it_says
    do_what_it_says : () => {
        // To read what's in the random.txt file, we need to bring in fs
        var fs = require("fs");
        // Then, we can use that variable to read:
        fs.readFile("random.txt","utf8", (err, data) => {
            // We can do whatever we what to do with the data:
            // First, let's split the string and turn it into an array
            data = data.split(",");
            // Then, let's grab the action to do and the task to be done
            var action = data[0];
            var task =  data[1];  
            //  Now, let's check if the action is spotify-this-song or anything else using the switch statement:
            switch (action) {
                case "spotify-this-song":
                    // If so, we run that method and pass in our task as the query
                    gbmbLiri.spotify_this_song(task);
                    break;
                case "movie-this":
                    gbmbLiri.movie_this(task);
                    break;
            
                default:
                    break;
            };
            
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
    case "spotify-this-song":
        gbmbLiri.spotify_this_song();
        break;
    case "do-what-it-says":
        gbmbLiri.do_what_it_says();
        break;
    default:
        break;
}
