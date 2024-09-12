const mongoose = require('mongoose')

const EpisodesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    SeriesId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Series",
        required: true
    },
    seasonNo:{
        type: String,
        required: true
    },
    EpisodeTitle:{
        type: String,
        required: true
    },
    EpisodeNumber:{
        type: Number,
        required: true
    },
    EpisodeImage:{
        type: String,
        required: true
    },
    EpisodeVideo:{
        type: String,
        required: true
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Episode',EpisodesSchema)