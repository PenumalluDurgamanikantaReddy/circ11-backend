const axios = require('axios')
const cheerio = require('cheerio');





const fetchTodayMatches = async () => {
  try {
    const { data: html } = await axios.get('https://www.espncricinfo.com/live-cricket-match-schedule-fixtures', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
        'Referer': 'https://www.google.com/',
      },
    });

    const $ = cheerio.load(html);
    const matches = [];

    $('.ds-py-3').each((_, section) => {
      const sectionTitle = $(section).find('h2').text().trim();

      // You can skip past matches and only pick "Today", "Tomorrow", or "Upcoming"
      if (!/Today|Tomorrow|Upcoming/i.test(sectionTitle)) return;

      $(section).find('.ds-px-4.ds-py-3').each((_, matchCard) => {
        const teams = [];
        $(matchCard).find('.ds-text-tight-s.ds-font-bold').each((_, el) => {
          teams.push($(el).text().trim());
        });

        const matchTime = $(matchCard).find('.ds-text-tight-xs.ds-font-regular').first().text().trim();
        const venue = $(matchCard).find('.ds-text-tight-xs.ds-font-regular').last().text().trim();

        matches.push({
          section: sectionTitle,
          team1: teams[0] || '',
          team2: teams[1] || '',
          time: matchTime,
          venue: venue,
        });
      });
    });

    console.log(JSON.stringify(matches, null, 2));
    return matches;
  } catch (err) {
    console.error('Error fetching matches:', err.message);
    return [];
  }
};




module.exports = { fetchTodayMatches}
