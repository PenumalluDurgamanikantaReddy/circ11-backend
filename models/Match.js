const mongoose =  require('mongoose')

const matchSchema = new mongoose.Schema({

    team1:String,
    team2:String,
    time:String,
    timezone:String,
    formate:String,
    venue:String,
    series:String,
    matchUrl:String,
},{collection:"matches",timestamps:true})

module.exports =  mongoose.model("Match",matchSchema)