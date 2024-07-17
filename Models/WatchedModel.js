const mongoose = require('mongoose')

const WatchedSchema = new mongoose.Schema({
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
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Watched',WatchedSchema)