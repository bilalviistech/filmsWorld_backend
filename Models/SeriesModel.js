const mongoose = require('mongoose')

const SeriesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Title: {
        type: String,
        required: true
    },
    SeriesBanner: {
        type: String,
        // required: true
    }

},{
    timestamps: true
})
module.exports = mongoose.model('Series',SeriesSchema)