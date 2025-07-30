const axios = require('axios')


const getTodatMatches = async(req,res)=>{


try{

const macthes = [ {id:1,teamA:'Austrlia',teamB:"India"}]
res.status(200).json(macthes)
}
catch(err){
res.status(500).json({error:"Something went wrong"})
}

}

module.exports = {getTodatMatches}