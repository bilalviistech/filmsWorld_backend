const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Season: {
        type: Array,
        required: true
    },

},{
    timestamps: true
})
module.exports = mongoose.model('Session',SessionSchema)