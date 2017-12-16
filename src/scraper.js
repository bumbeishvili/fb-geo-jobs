var Crawler = require('crawler');
var utils = require('./utils.js');
require('./prototypes.js');

var scraper = {};

scraper.configs = {
  sites: [
    {
      siteName: 'www.jobs.ge',
      scrapingMethod: 'jobsge',
      categories: [
        {
          id: "finance",
          name: "ფინანსები",
          url: "http://www.jobs.ge/?page=1&keyword=&cat=finance&location=&view=",
          fb: "finance"
        }, {
          id: "it",
          name: "IT",
          url: "http://www.jobs.ge/?page=1&keyword=&cat=it&location=&view=",
          fb: "it"
        }
      ]
    }
  ]
}

scraper.scrapingMethods = {
  jobsge: jobsGeCrawler
};

scraper.crawle = function () {
  return new Promise((resolve, reject) => {
    var total = scraper.configs.sites.$sum(s => s.categories.length);
    var counter = 0;
    var totalResult = [];
    console.log(`Starting  ${total} crawling`);
    scraper.configs.sites.forEach(site => {
      site.categories.forEach(category => {
        console.log(`Crawling ${site.siteName} => ${category.id}`);
        scraper.scrapingMethods[site.scrapingMethod](category, function (result) {
          counter++;
          console.log(`Left  ${total - counter} response`);
          totalResult.push(result)
          if (counter == total) {
            var combinedArrays = utils.combineArrays(totalResult)
            combinedArrays.forEach(utils.setCompositeID);
            resolve(combinedArrays);
          }
        }, counter)
      })
    })
  })
}



function jobsGeCrawler(category, callback) {
  var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;
        var jobs = $('.regularEntries tr')
          .map((i, d) => d)
          .filter((i, d) => i > 0)
          .map((i, d) => $(d)
            .find('td')
            .map((i, d) => {
              return {
                link: $(d).find('a').map((i, l) => 'www.jobs.ge' + $(l).attr('href'))[0],
                text: $(d).text()
              }
            }))
          .map((i, d) => {
            return {
              site: 'jobs.ge',
              link: d[1].link,
              salary: null,
              pos: d[1].text,
              company: d[3].text,
              postedOn: d[4].text,
              validTill: d[5].text,
              type: category.id,
            }
          })
        console.log('Got result of of length', jobs.length);

        var result = [];
        for (var i = 0; i < jobs.length; i++) {
          result.push(utils.cleanStrings(jobs[i]));
        }


        if (typeof callback == 'function') {
          callback(result);
        }
      }
      done();
    }
  })
  c.queue(category.url);
}

module.exports = scraper;