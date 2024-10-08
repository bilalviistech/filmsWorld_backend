const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        default:"null"
    },
})

module.exports = mongoose.model('User',UserSchema)