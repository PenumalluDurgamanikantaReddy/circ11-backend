const axios = require("axios");
const cheerio = require("cheerio");
const Match = require("../models/Match");
const Team = require("../models/Team");

const {fetchPlayerStats}  = require('../controllers/playerStatsController'); 
const { addPlayersToQueue } = require("../queue/playerQueue");
const fetchTodayMatches = async (req, res) => {
  try {
    const { data: html } = await axios.get(
      "https://www.espncricinfo.com/live-cricket-match-schedule-fixtures",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "text/html",
        },
      }
    );

    const $ = cheerio.load(html);
    const scriptContent = $("#__NEXT_DATA__").html();
    const jsonData = JSON.parse(scriptContent);
    const allMatches =
      jsonData?.props?.appPageProps?.data?.data?.content?.matches || [];

    const today = new Date().toISOString().split("T")[0]; // e.g., '2025-08-07'

    const todayMatches = allMatches.filter((match) => {
      const matchDate = match?.startTime?.split("T")[0];
      return matchDate === today;
    });

    const formatted = todayMatches.map((match) => ({
      team1: match?.teams?.[0]?.team?.longName || "",
      team2: match?.teams?.[1]?.team?.longName || "",
      time: match?.startTime || "",
      timezone: match?.ground?.town?.timezone || "",
      formate: match?.format || "",
      venue: match?.ground?.name || "",
      series: match?.series?.name || "",
      status: match?.statusText || "",
      matchUrl: `https://www.espncricinfo.com/series/${match?.slug}-${match?.objectId}/${match?.slug}-${match?.objectId}/live-cricket-score`,
    }));

    for (let match of formatted) {
      if (match.matchUrl) {
      await  getMatchData(match.matchUrl);
      }
      await Match.findOneAndUpdate(
        {
          matchUrl: match.matchUrl,
        },
        match,
        { upsert: true, new: true }
      );
    }

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching matches:", err.message);
    return [];
  }
};


const delay = (ms)=>new Promise((res)=> setTimeout(res,ms))


const fetchPlayStats=(player)=>{
  console.log(player.player.slug,player.player.objectId)
}
const getMatchData = async (req, res) => {
  const matchUrl = req;
  try {
    const { data: html } = await axios.get(matchUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Cache-Control": "no-cache",
        Referer: "https://www.espncricinfo.com/",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "edition=espncricinfo-en-in;",
      },
    });

    const $ = cheerio.load(html);
    const scriptContent = $(`#__NEXT_DATA__`).html();
    const jsonData = JSON.parse(scriptContent);
    const matchData =jsonData?.props?.appPageProps?.data?.data?.content?.matchPlayers || [];
      const teams = matchData?.teamPlayers || [];

    for (let team of teams) {
      if (team?.players?.length > 0) {
        await Team.findOneAndUpdate(
          {
            teamName: team?.team?.longName,
          },
          {
            teamName: team?.team?.longName,
            abbreviation: team?.team?.abbreviation,
            teamId: team?.team?.id,
            squad: team?.players,
          },
          { upsert: true, new: true }
        );

  
addPlayersToQueue(team?.players);
      }
   

      
   
    }

    
  } catch (error) {
    console.log(error);
    //  res.status(500).json({error:"Something went wrong"})
  }
};

module.exports = { fetchTodayMatches };
