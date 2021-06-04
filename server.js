const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors') //CORS is a node. js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const path = require('path') //The path module provides utilities for working with file and directory paths. It can be accessed using: const path = require('path');
const port = process.env.PORT || 3001 //In many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.
//Some services (like Heroku, Nodejitsu, and AWS) does this. If you try to set a static port value like 3001 instead of process.env.PORT || 3000 where 3000 is your static setting, then your application will result in a 500 gateway error because Amazon is configuring the port for you.

app.use(bodyParser.json()) //indicate that app uses body-parser not json
app.use(cors())

//mongoose
mongoose.connect(
  'mongodb+srv://admin:wanrltw32866@cluster0.cdf90.mongodb.net/moviesDB', //connect here to mongoDB Atlas
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)

//data schema and model
const movieSchema = {
  // creating here property columns for the model
  title: String,
  genre: String,
  year: Number,
}

const Movie = mongoose.model('Movie', movieSchema) //creating model itself

// const filmeOne = new Movie({
//   title: 'Avengers',
//   genre: 'Sci-Fi',
//   year: 1995,
// })

// const filmeTwo = new Movie({
//   title: 'Avengers 2',
//   genre: 'Sci-Fi',
//   year: 1997,
// })

// Movie.insertMany([filmeOne, filmeTwo], (err) => {
//   if (err) {
//     console.log(err)
//   }
// })

//API routes
app.get('/movies', (req, res) => {
  //go ro client -> package.json and add there in properties -> "proxy": "http://localhost:3001",
  //when server gets request for '/' route il will execure what is in the second parameter in this case it executes arrow function
  Movie.find().then((movies) => res.json(movies))
})
//posting movie to our db
app.post('/newmovie', (req, res) => {
  //when our server gets /newmovie route it take data form req(uest) put that data into newMovie object and then saves(posts) that objec to our db
  //post or get dosen't necessarily mean to render a page it can be simply just what the server must to do when such methods occured in it
  const title = req.body.title
  const genre = req.body.genre
  const year = req.body.year

  const newMovie = new Movie({
    title, //we don't need to write here like title: tile, genre:genre etc....
    genre,
    year,
  })

  newMovie.save() // !!!!!!!!IMPORTANT!!! posting movie to our db
})

//where :id that means it's dynamical part
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id // _id is a part of request parameter
  Movie.findOneAndDelete({ _id: id }, (err) => {
    if (err) {
      console.log(err)
    }
  }) //findOneAndDelete method of mongoDB meanse ->
  // it is here where we actually delete movie document/record  form our collection Movie where _id === id from request parameter
})

app.listen(port, () => `Runs on ${port} port`)
