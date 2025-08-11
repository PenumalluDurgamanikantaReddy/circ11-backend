


// const axios = require('axios');
// const cheerio = require('cheerio');

// const getPlayerStats = async (req, res) => {
//   const playerUrl = req.query.playerUrl;
//   if (!playerUrl) {
//     return res.status(400).json({ success: false, message: 'Missing playerUrl' });
//   }

  // try {
  //   const {data} = await axios.get(playerUrl, {
  //   headers: {
  //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  //   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  //   'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
  //   'Referer': 'https://www.espncricinfo.com/',
  //   'Cache-Control': 'no-cache',
  //   'Pragma': 'no-cache',
  //   'Upgrade-Insecure-Requests': '1',
  //   'Sec-Fetch-Dest': 'document',
  //   'Sec-Fetch-Mode': 'navigate',
  //   'Sec-Fetch-Site': 'same-origin',
  //   'Sec-Fetch-User': '?1',
  //   'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
  //   'Sec-Ch-Ua-Mobile': '?0',
  //   'Sec-Ch-Ua-Platform': '"Windows"',
  // }
  //   });

//     const $ = cheerio.load(data);
//     // const playerName = $('h1').first().text().trim();
//     const playerName = $('h1').first().text().trim();
    
//     console.log(playerName)

//     const stats = [];

//     // Parse stat tables
//     $('table.ds-w-full.ds-table.ds-table-xs.ds-table-auto.ci-scorecard-table').each((i, table) => {
//       const format = $(table).prev('h5').text().trim(); // ODI, Test, T20I etc.
//       const headers = [];
//       const rows = [];

//       $(table)
//         .find('thead tr th')
//         .each((i, el) => headers.push($(el).text().trim()));

//       $(table)
//         .find('tbody tr')
//         .each((i, row) => {
//           const rowData = {};
//           $(row)
//             .find('td')
//             .each((i, cell) => {
//               rowData[headers[i]] = $(cell).text().trim();
//             });
//           rows.push(rowData);
//         });

//       stats.push({
//         format,
//         headers,
//         rows,
//       });
//     });

//     res.json({
//       success: true,
//       playerName,
//       stats,
//     });
//   } catch (err) {
//     console.error('Error scraping:', err.message);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch player stats',
//       error: err.message,
//     });
//   }
// };

// module.exports = { getPlayerStats };

// const axios = require('axios');
// const cheerio = require('cheerio');
// const {HttpsProxyAgent} = require('https-proxy-agent');
    


// const proxyAgent =  new HttpsProxyAgent('http://156.233.91.79:3129')

// const getPlayerStats = async (req, res) => {
//   const playerUrl = req.query.playerUrl;
//   if (!playerUrl) {
//     return res.status(400).json({ success: false, message: 'Missing playerUrl' });
//   }
// const userAgents = [
//   'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
//   'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
// ];
//   try {
//     const { data: html } = await axios.get(playerUrl, {
//       headers: {
//     'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
//         'Accept': 'text/html',
//         'Referer': 'https://www.espncricinfo.com/',
//       },
//         // httpsAgent: proxyAgent

//     });

//     const $ = cheerio.load(html);
//     const playerName = $('h1').first().text().trim();
//     const stats = [];
//    $('table.ds-table.ds-table-auto').each((i, table) => {
//       // Try to fetch format from closest parent section
//       const format = $(table).closest('div').prevAll('h5').first().text().trim();
//       const headers = [];
//       const rows = [];

//       $(table).find('thead tr th').each((i, el) => {
//         headers.push($(el).text().trim());
//       });

//       $(table).find('tbody tr').each((i, row) => {
//         const rowData = {};
//         $(row).find('td').each((j, cell) => {
//           rowData[headers[j]] = $(cell).text().trim();
//         });
//         rows.push(rowData);
//       });

//       stats.push({
//         format: format || `Format ${i + 1}`,
//         headers,
//         rows,
//       });
//     });

//     res.status(200).json({
//       success: true,
//       playerName,
//       stats,
//     });
//   } catch (err) {

//     console.log(err)
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch player stats',
//       error: err.message,
//     });
//   }
// };
// module.exports = { getPlayerStats };


const axios = require('axios');
const cheerio = require('cheerio');
const Player = require('../models/Player')


const fetchPlayerStats = async (playerUrl) => {
  if (!playerUrl) throw new Error('Missing playerUrl');
      

  console.log(playerUrl)
  const { data: html } = await axios.get(playerUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const $ = cheerio.load(html);
  const playerName = $('h1').first().text().trim();

  const career = [];
  const leagues = [];
  const recentMatches = [];

  $('table.ds-w-full.ds-table').each((i, table) => {
    const formatTitle =
      $(table).closest('div').prevAll('h5,h4').first().text().trim() ||
      `Format ${i + 1}`;

    const headers = [];
    const rows = [];

    $(table).find('thead tr th').each((_, th) => {
      headers.push($(th).text().trim());
    });

    $(table).find('tbody tr').each((_, tr) => {
      const rowData = {};
      $(tr).find('td').each((j, td) => {
        rowData[headers[j]] = $(td).text().trim();
      });
      rows.push(rowData);
    });

    const headerSet = new Set(headers.map((h) => h.toLowerCase()));
    const tableData = { format: formatTitle, headers, rows };

    if (headerSet.has('match') && headerSet.has('date')) {
      recentMatches.push(tableData);
    } else if (headerSet.has('tournament') && headerSet.has('teams')) {
      leagues.push(tableData);
    } else {
      career.push(tableData);
    }
  });

  let playerRole = '';
  let battingStyle = '';
  let bowlingStyle = '';
  $('div:has(p.ds-text-tight-m)').each((_, div) => {
    const label = $(div).find('p.ds-text-tight-m').text().trim();
    const value = $(div).find('span p').text().trim();

    if (label === 'Batting Style') battingStyle = value;
    else if (label === 'Bowling Style') bowlingStyle = value;
    else if (label === 'Playing Role') playerRole = value;
  });


  return {
    playerName,
    playerRole,
    battingStyle,
    bowlingStyle,
    career,
    leagues,
    recentMatches,
  };
  


};

module.exports = { fetchPlayerStats };
