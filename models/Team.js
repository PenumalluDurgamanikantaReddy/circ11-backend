

const  mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName:String,
    abbreviation:String,
    teamId:Number,
    squad:Object      

})


module.exports = mongoose.model("Team",teamSchema)