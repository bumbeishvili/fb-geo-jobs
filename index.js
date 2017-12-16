
var scraper = require('./src/scraper.js');


const express = require('express');
const app = express();


app.get('/', (req, resspo) => {
  console.log('get crawler request')
  scraper.crawle(function (result) {
    resspo.json(result);
  });
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))