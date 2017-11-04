var fs = require("fs"); //reads and writes files
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var liriCommand = process.argv[2];

    switch(liriCommand){
        case 'my-tweets': myTweets();
            break;
        case 'spotify-this-song': spotifyThisSong();
            break;
        case 'movie-this': movieThis();
            break;
        case 'do-what-it-says': doWhatItSays();
            break;
        default: console.log('\r\n' + 'Try typing one of the following commands after \'node liri.js\':'+ '\r\n' +
            '1: my-tweets \'twitter-handle\'' + '\r\n' +
            '2: spotify-this-song \'song-name\'' + '\r\n' +
            '3: movie-this \'movie-title\'' + '\r\n' +
            '4: do-what-it-says' + '\r\n' +
            'Make sure you put the search query in quotes'
        );
    }

    function myTweets(){
        var client = new twitter({
            consumer_key: keys.twitterKeys.consumer_key,
            consumer_secret: keys.twitterKeys.consumer_secret,
            access_token_key: keys.twitterKeys.access_token_key,
            access_token_secret: keys.twitterKeys.access_token_secret
        });

        var username = process.argv[3];
        if (!username){
            username = "drj613";
        }

        var params = {screen_name: username};
        client.get('statuses/user_timeline/', params, function(error, data, response){
            if(error){
                console.log("ERROR WITH TWITTER CALL! " + JSON.stringify(error, null, 2));
            } else {
                for (var i = 0; i < data.length; i++){
                    var tweets = data[i].created_at + "\r\n" +
                    "@" + data[i].user.screen_name + ": " + data[i].text + "\r\n" +
                    "-----------------------------------------------";
                    console.log(tweets);
                    log(tweets);
                }
            }
        });
    } //working

    function spotifyThisSong(){
        var song = process.argv[3];
        var spotify = new Spotify({
            id: keys.spotifyKeys.id,
            secret: keys.spotifyKeys.secret
        });

        if(!song){
            song = "The Sign";
        }   

        var params = song;
        spotify.search({type: "track", query: params}, function(err, data){
            var numToLoop = 5;
            if (data.tracks.length < 5){
                numToLoop = data.tracks.length;
            }
            for (var i=0;i<numToLoop; i++){
                var iSongObj = data.tracks.items[i];
                var title = iSongObj.name,
                    album = iSongObj.album.name,
                    artist = iSongObj.artists[0].name,
                    previewUrl = iSongObj.preview_url;

                var simpResults = 
                    "Song: " + title + "\r\n" +
                    "Album: " + album + "\r\n" +
                    "Artist: " + artist + "\r\n" +
                    "Preview URL: " + previewUrl + "\r\n" +
                    "-----------------------------------------------";
                
                console.log(simpResults);
                log(simpResults);
            }
        });      
    } 

    function movieThis(){
        var movieTitle = process.argv[3];
        if(!movieTitle){
            movieTitle = "Mr. Nobody";
        }
        var key = keys.omdbKey.key;
        var params = movieTitle;
        request("http://www.omdbapi.com/?apikey="+key+"&t="+params+"&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
			if (error){
                console.log("ERROR WITH OMDB REQUEST! " + error);
            } else {
				var movieObject = JSON.parse(body);
				var movieResults =
				"Title: " + movieObject.Title+"\r\n"+
				"Year: " + movieObject.Year+"\r\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\r\n"+
				"Country: " + movieObject.Country+"\r\n"+
				"Language: " + movieObject.Language+"\r\n"+
				"Plot: " + movieObject.Plot+"\r\n"+
				"Actors: " + movieObject.Actors+"\r\n"+
                "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n";
                console.log(movieResults);
				log(movieResults);
			}
		});
    } //working

    function doWhatItSays(){
        fs.readFile("random.txt", "utf8", function(error, data){
            if (error){
                console.log("ERROR " + error);
            } else {
                var doItResults = data.split(",");
                console.log(doItResults);
                // spotifyThisSong(doItResults[1]);
            }
        })
    }


    function log(toLog){
        fs.appendFile("log.txt", toLog, (error) => {
            if(error){
                throw error;
            }
        });
    }
    