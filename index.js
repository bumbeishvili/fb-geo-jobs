


const express = require('express');
var utils = require('./src/utils.js');




const app = express();


var Crawler = require('crawler');


`$('.regularEntries tr').map((i,d)=>d).filter((i,d)=>i>0).map((i,d)=>$(d).find('td').text()).map((i,d)=>d.toString().split(/\t+/g))`



app.get('/', (req, resspo) => {

  var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;
        var title = $("title").text();
        resspo.send('test');
      }
      done();
    }
  });

  c.queue('http://jobs.ge/?page=1&keyword=&cat=it&location=&view=');

})
app.listen(3000, () => console.log('Example app listening on port 3000!'))