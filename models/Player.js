
const  mongoose = require("mongoose")


const playerSchema = new mongoose.Schema({
playerName:String,
playerRole:String,
battingStyle:String,
bowlingStyle:String,
career:Object,
leagues:Object,
recentMatches:Object

},{timestamps:true})


module.exports = mongoose.model("Player",playerSchema)