//This is a dotenv package that will use the .env file to set what are known as environment variables to the global process.env object in node.
require("dotenv").config();

//Required node packages
var axios = require('axios');
var fs = require('fs');
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//The command choice the user asks liri
var choice = process.argv[2];
//Slicing (removing) the first three items from the process.argv array and joining the user search results with a space
var input = process.argv.slice(3).join(" ");

//Switch case function taking in the user command choice and input for each scenario
function userCommand(choice, input) {
    switch (choice) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doThis(input);
            break;
        default:
            console.log("Looks like something went wrong, please try again.");
            break;
    }
}

//Calling the switch case function
userCommand(choice, input);

//Spotify-this function using the spotify api
function spotifyThis() {
    //default input if there is no input from user
    if (!input) {
        input = "the sign ace of base"
    };

    //searching spotify with the user input for 1 track
    spotify.search({type: 'track', query: input, limit: 1}, function(error, data) {
        //error catch and console.log
        if (error) {
            console.log('Error occurred: ' + error);
        }

        //console.log results
        var songSearched = data.tracks.items;
        console.log("========================");
        console.log("Artist: " + songSearched[0].artists[0].name);
        console.log("Song Title: " + songSearched[0].name);
        console.log("Link to Song: " + songSearched[0].preview_url);
        console.log("Album: " + songSearched[0].album.name);
        console.log("========================");
    });
}

//Concert-this function using axios to call the bandsintown api
function concertThis() {
    //default input if there is no input from user
    if (!input) {
        input = "Rick Astley";
    }

    //axios get callback to the bandsintown api
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function(response) {
        for (i = 0; i < 5; i++) {
            console.log("========================");
            console.log("Venue: " + response.data[i].venue.name);
            console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
            console.log("Date: " + moment(response.data[i].datetime).format("L"));
        }
    });
}

//Movie-this function using axios to call the omdb api
function movieThis() {
    //default input if there is no input from user
    if (!input) {
        input = "Mr. Nobody";
        console.log("If you haven't watched Mr. Nobody then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    };

    //axios get callback to the omdb api
    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy")
    .then (function(response) {
        console.log("========SEARCHING...========");
        console.log("Title: " + response.data.Title);
        console.log("Released: " + response.data.Year);
        console.log("IMDb Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Cast: " + response.data.Actors);
        console.log("============================");
    })
}

//Do-this function using fs to read the random.txt file
function doThis() {
    //fs reading random.txt
    fs.readFile("random.txt", "utf8", function(err, data) {
        //error catch and console.log
        if (err) {
            console.log(err);
        }

        //splitting the data in random.txt into an array variable
        var readArray = data.split(",");

        //setting input to the second value in the array declared above
        input = readArray[1];

        //using the spotify-this function to display the variable above
        spotifyThis(input);
    })
}