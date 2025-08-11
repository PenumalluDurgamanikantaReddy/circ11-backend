const { fetchPlayerStats } = require("../controllers/playerStatsController");
const Player = require("../models/Player");

let playerQueue = [];
let isProcessing = false;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const startPlayerQueueWorker = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (playerQueue.length > 0) {
    const player = playerQueue.shift();

    try {
      let url = `https://www.espncricinfo.com/player/${player.player.slug}-${player.player.objectId}`;
     let response= await fetchPlayerStats(url);

    const playExists = await Player.findOne({playerName:response.playerName})
  if(playExists){
     await Player.updateOne(
       { _id:response.playExists?._id},
        {
          $set:{
            career:response?.career,
            leagues:response?.leagues,
            recentMatches:response?.recentMatches
          }
        }
      )
  }else{
     await Player.create({
      playerName:response?.playerName,
      playerRole:response?.playerRole,
      battingStyle:response?.battingStyle,
      bowlingStyle:response?.bowlingStyle,
      career:response?.career,
      leagues:response?.leagues,
      recentMatches:response?.recentMatches
     })
  }
      console.log(`✅ Processed: ${player.player.slug}`,response);
    } catch (err) {
      console.error(`❌ Error fetching ${player.player.slug}:`, err.message);
    }
    await delay(60000); // 40 sec gap
  }

  isProcessing = false;
  console.log("🎯 Player queue is empty.");
};

const addPlayersToQueue = (players) => {
    // console.log(players, 'players')
  playerQueue.push(...players);
  startPlayerQueueWorker();
};

module.exports = {
  addPlayersToQueue,
  startPlayerQueueWorker
};
