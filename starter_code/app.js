require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser")
const app = express();


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* GET home page */
app.get('/', (req, res, next) => {
  res.render('index');
});
app.get('/artist', (req, res, next) => {
  res.render('artist');
});

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });


app.post("/artist", (req, res, next) => {
  spotifyApi
  .searchArtists(req.body.artist)
  .then(data => {
    // console.log("The received data from the API: ", data.body.artists);
    const artists= data.body.artists.items;
    // console.log(artists)
    res.render('artist', {artists})
    // console.log(data.body.artists.items)

  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});

app.get("/albums/:id", (req, res, next) => {
  console.log(req.params.id)
  spotifyApi.getArtistAlbums(req.params.id)
  .then(data=> {
    console.log(data)
    const albums= data.body.items;
    res.render('album', {albums})
  }).catch((err)=>{console.log(err)})
})
app.get("/tracks/:id", (req, res, next) => {
  
  spotifyApi.getAlbumTracks(req.params.id)
  .then(data=> {
    console.log(data)
    const tracks= data.body.items;
    res.render('tracks', {tracks})
  }).catch((err)=>{console.log(err)})
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
