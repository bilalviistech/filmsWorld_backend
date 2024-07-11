const express = require('express')
const Route = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})
const AuthMiddleware = require('./Middleware/AuthMiddleware')
const AuthController = require('./Controllers/AdminController')
const MovieController = require('./Controllers/MovieController')
const DB = require('./Config/ConnectDB')
DB()

//
// const PicStorage = multer.memoryStorage()
// const PicUpload = multer({ storage: PicStorage})
//

// Auth
Route.post('/user/register', AuthController.Register)
Route.post('/user/login', AuthController.Login)

// Route.post('/admin/add-movie', upload.single('video'), PicUpload.single('thumbnail'), AuthController.AddMovie)
Route.post('/admin/add-movie', upload.fields([ { name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 } ]), AuthController.AddMovie);
Route.post('/admin/events', AuthController.Events)

// App Routes
// Movie Routes
Route.get('/user/get-all-movies', AuthMiddleware, MovieController.GetAllMovie)
Route.get('/user/get-movies-title/:title', AuthMiddleware, MovieController.GetMoviesByTitle)
Route.get('/user/get-movies-category/:category', AuthMiddleware, MovieController.GetMoviesByCategory)
Route.post('/user/watch-later/:movieId', AuthMiddleware, MovieController.WatchLater)


module.exports = Route
