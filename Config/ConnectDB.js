const mongoose = require('mongoose')

const connectDB = ()=>{
    // const connect =  mongoose.connect("mongodb://127.0.0.1:27017")
    const connect = mongoose.connect('mongodb+srv://filmsworldpkfilms:UEfWwpq6kzRSIs2u@cluster0.shsnl5p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    const db = mongoose.connection

    db.on("error", err=>console.log(err))
    db.once("open",()=>console.log("DB Connected"))
}

module.exports = connectDB