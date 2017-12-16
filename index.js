
var scraper = require('./src/scraper.js');
var mdao = require('./src/mdao.js');


const express = require('express');
const app = express();


app.get('/insertNew', (req, res) => {
  scraper.crawle()
    .then(function (scrapedJobs) {
      console.log(`scraped ${scrapedJobs.length} jobs, filtering new jobs`)
      return mdao.filterNewJobs(scrapedJobs)
    })
    .then(function (newJobs) {
      console.log(`got new  ${newJobs.length} jobs, inserting`)
      return mdao.insertNewJobs(newJobs)
    })
    .then(function (dbData) {
      console.log('inserted jobs, print statistics')
      res.json({ count: dbData.length });
    })
})


app.get('/post', (req, res) => {
  mdao.loadUnposted()
    .then(function (unposted) {
      res.json(unposted);
    })
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))