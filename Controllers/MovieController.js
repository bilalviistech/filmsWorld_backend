const Movie = require('../Models/MovieModel')
const Favorite = require('../Models/FavoriteMovieModel');
const MovieModel = require('../Models/MovieModel');
const mongoose = require('mongoose')

class MovieController {
    static GetAllMovie = async (req, res) => {
        try {
            const PageNumber = req.query.page || 1;
            const PageLimitData = 10;

            const AllMovie = await Movie.paginate({}, { page: PageNumber, limit: PageLimitData })

            res.status(200).json({
                success: true,
                data: AllMovie.docs,
                totalDocs: AllMovie.totalDocs,
                limit: AllMovie.limit,
                totalPages: AllMovie.totalPages,
                currentPage: AllMovie.page,
                pagingCounter: AllMovie.pagingCounter,
                nextPage: AllMovie.nextPage
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }

    }

    static GetMoviesByTitle = async (req, res) => {
        try {
            const title = req.params.title
            const PageNumber = req.query.page || 1;
            const PageLimitData = 10;

            const AllMovie = await Movie.paginate({ movieTitle: { $regex: title, $options: 'i' } }, { page: PageNumber, limit: PageLimitData })

            res.status(200).json({
                success: true,
                data: AllMovie.docs,
                totalDocs: AllMovie.totalDocs,
                limit: AllMovie.limit,
                totalPages: AllMovie.totalPages,
                currentPage: AllMovie.page,
                pagingCounter: AllMovie.pagingCounter,
                nextPage: AllMovie.nextPage
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetMoviesByCategory = async (req, res) => {
        try {
            const category = req.params.category
            const PageNumber = req.query.page || 1;
            const PageLimitData = 10;

            const AllMovie = await Movie.paginate({ movieCategory: { $elemMatch: { $regex: category, $options: 'i' } } }, { page: PageNumber, limit: PageLimitData })

            res.status(200).json({
                success: true,
                data: AllMovie.docs,
                totalDocs: AllMovie.totalDocs,
                limit: AllMovie.limit,
                totalPages: AllMovie.totalPages,
                currentPage: AllMovie.page,
                pagingCounter: AllMovie.pagingCounter,
                nextPage: AllMovie.nextPage
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static WatchLater = async (req, res) => {
        try {
            const MovieId = req.params.movieId
            const UserId = req.user._id
            
            const MovieExist = await Movie.findOne({_id: MovieId})

            if(MovieExist){

                const AddedFavorite = await Favorite.findOne({UserId: UserId, MovieId: MovieId})
                if(AddedFavorite){
                    await Favorite.deleteOne({ _id: AddedFavorite._id });
                    return res.status(200).json({
                        success: true,
                        message: "Removed from watch later."
                    })    
                }
                const AddFavorite = new Favorite({
                    _id: new mongoose.Types.ObjectId(),
                    UserId: req.user._id,
                    MovieId: MovieId
                })
                await AddFavorite.save()

                res.status(200).json({
                    success: true,
                    message: "Added in watch later."
                })
            }
            else{
                res.status(200).json({
                    success: false,
                    message: "Movie doesn't exist."
                })
            }

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

}



module.exports = MovieController