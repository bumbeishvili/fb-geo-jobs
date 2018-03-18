
var scraper = require('./src/scraper.js');
var mdao = require('./src/mdao.js');
var fbApi = require('./src/fbApi.js');
var utils = require('./src/utils.js');
require('./src/prototypes.js');

var statuses = {
  processing: "processing",
  idle: "idle",
}
var status = statuses.idle;
var salaryStatus = statuses.idle;



const express = require('express');
const app = express();

app.use('/fbApi', fbApi.router);


app.get('/insertNew', (req, res) => {
  scraper.crawle()
    .then(function (scrapedJobs) {
      console.log(`scraped ${scrapedJobs.length} jobs, filtering new jobs`)
      return mdao.filterNewJobs(scrapedJobs)
    })
    .then(function (newJobs) {
      console.log(`got new  ${newJobs.length} jobs, inserting`)
      return utils.setFlags(newJobs)
    })
    .then(function (newJobs) {
      console.log(`got new  ${newJobs.length} jobs, inserting`)
      return mdao.insertNewJobs(newJobs)
    })
    .then(function (dbData) {
      console.log('inserted jobs, print statistics')
      res.send(dbData);
    })
})


app.get('/stats', (req, res) => {
  mdao.getUnpostedWithSalaryStatistics()
    .then(stats => {
      res.json(stats);
    })
})


app.get('/allItems', (req, res) => {
  mdao.getAllItems()
    .then(allItems => {
      res.json(allItems);
    })
})



app.get('/updateSalaries', (req, res) => {
  if (salaryStatus == statuses.processing) {
    res.send('Already Processing');
    return;
  }
  salaryStatus = statuses.processing

  scraper.updateSalaries()
    .then(function (result) {
      res.send('updated 30 salaries');
      salaryStatus = statuses.idle;
    })
})


app.get('/post', (req, res) => {
  if (status == statuses.processing) {
    res.send('Already Processing');
    return;
  }
  status = statuses.processing
  console.log('started posting');
  fbApi.startPosting().then(() => {
    res.send('all jobs posted');
    status = statuses.idle;
  })
})


app.get('/status/:newValue', (req, res, next) => {
  const newValue = req.params.newValue;
  res.send(0);
})


app.get('/log', (req, res, next) => {
  res.send(0);;
});



// updater
app.get('/setParsedSalariesAndSetFlags', (req, res) => {
  var db = mdao.getDB();
  var results = [];
  db.jobs.find({ posted: { $ne: true }, scrapedForSalary: true }, (error, items) => {
    console.log('updated', items)
    items.forEach((item, i) => {
      item.posted = true;
      setInterval(function (d) {
        mdao.updateItem(item).then(d => {
          console.log('updated', i)
        }, 1 * 1000);
      })

    });
  });
  res.send('good')
})

var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Example app listening on port 3000!'))
