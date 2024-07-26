const mongoose = require('mongoose')

const SuggestionSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    AnySuggestion: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('Suggestion', SuggestionSchema)