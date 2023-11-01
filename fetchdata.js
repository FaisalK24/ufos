const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ufo_sightings.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the UFO sightings database.');
});

const fetchAndPopulateData = async () => {
  try {
    const response = await axios.get('http://www.nuforc.org/webreports.html');
    const data = parseAndExtractData(response.data);
    populateDatabase(data);
  } catch (error) {
    console.error('Error fetching data from the National UFO Reporting Center:', error);
  }
};

const cheerio = require('cheerio');

// Function to parse and extract data from the HTML content
const parseAndExtractData = (htmlData) => {
  const sightings = [];
  const $ = cheerio.load(htmlData);
  $('tbody > tr').each((index, element) => {
    const tds = $(element).find('td');
    const location = $(tds[1]).text().trim();
    const dateOfOccurrence = $(tds[0]).text().trim();
    const details = $(tds[5]).text().trim();
    sightings.push({ location, date_of_occurrence: dateOfOccurrence, details });
  });
  return sightings;
};


// Function to populate the SQLite database with the fetched data
const populateDatabase = (data) => {
  data.forEach((item) => {
    db.run(
      'INSERT INTO sightings (location, date_of_occurrence, details) VALUES (?, ?, ?)',
      [item.location, item.date_of_occurrence, item.details],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with id ${this.lastID}`);
      }
    );
  });
};

fetchAndPopulateData();
