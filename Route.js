const express = require('express')
const Route = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})
const AuthMiddleware = require('./Middleware/AuthMiddleware')
const AuthController = require('./Controllers/AdminController')
const MovieController = require('./Controllers/MovieController')
const SeriesController = require('./Controllers/SeriesController')
const DB = require('./Config/ConnectDB')
DB()

//
// const PicStorage = multer.memoryStorage()
// const PicUpload = multer({ storage: PicStorage})
//

// Auth
Route.post('/user/register', AuthController.Register)
Route.post('/user/social-auth-register', AuthController.SocialAuthRegister)
Route.post('/user/login', AuthController.Login)

// Route.post('/admin/add-movie', upload.single('video'), PicUpload.single('thumbnail'), AuthController.AddMovie)
Route.post('/admin/add-movie', upload.fields([ { name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 } ]), AuthController.AddMovie);
Route.post('/admin/events', AuthController.Events)
Route.post('/admin/add-banner', upload.single('banner'), AuthController.AddBanner);

// App Routes
// Movie Routes
Route.get('/user/get-all-movies', AuthMiddleware, MovieController.GetAllMovie)
Route.get('/user/get-titles', AuthMiddleware, MovieController.GetMovieTitles)
Route.get('/user/get-movies-title/:title', AuthMiddleware, MovieController.GetMoviesByTitle)
Route.get('/user/get-movies-category/:category', AuthMiddleware, MovieController.GetMoviesByCategory)

// watch later
Route.post('/user/watch-later/:movieId', AuthMiddleware, MovieController.WatchLater)
Route.get('/user/get-all-watch-later', AuthMiddleware, MovieController.GetAllWatchLater)

// Watch Now
Route.post('/user/watch-now/:movieId', AuthMiddleware, MovieController.WatchNowPost)
Route.get('/user/get-all-watch-now', AuthMiddleware, MovieController.GetAllWatchNow)

// Banner
Route.get('/user/get-banner', AuthMiddleware, MovieController.GetBanner)

// Series
Route.post('/user/add-series', AuthMiddleware, upload.single('series'), SeriesController.AddSeries)
Route.get('/user/get-series', AuthMiddleware, SeriesController.GetAllSeries)

// Add episode
Route.post('/user/addepisodes/:seriesid', AuthMiddleware, upload.single('episode'), SeriesController.AddEpisodes)
Route.get('/user/get-episodes-by-series/:SeriesId', AuthMiddleware, SeriesController.GetEpisodesBySeries)


module.exports = Route
