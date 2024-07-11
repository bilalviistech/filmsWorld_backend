const Movie = require('../Models/MovieModel')

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

}



module.exports = MovieController