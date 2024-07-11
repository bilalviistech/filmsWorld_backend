const mongoose = require('mongoose')

const FavoriteMovieSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    MovieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    }
})

module.exports = mongoose.model('FavoriteMovie',FavoriteMovieSchema)