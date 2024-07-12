const mongoose = require('mongoose')

const BannerSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Banner:{
        type:String,
        required:true
    },

})

module.exports = mongoose.model('Banner',BannerSchema)