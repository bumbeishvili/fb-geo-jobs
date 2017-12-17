var Crawler = require('crawler');
var utils = require('./utils.js');
var mdao = require('./mdao.js');
require('./prototypes.js');

var scraper = {};

scraper.configs = {
  sites: [
    {
      siteName: 'www.jobs.ge',
      scrapingMethod: 'jobsge',
      categories: [
        {
          id: "financeWithoutSalary",
          name: "ფინანსები",
          url: "http://www.jobs.ge/?page=1&keyword=&cat=finance&location=&view=",
          fb: "finance",
        }, {
          id: "financeWithSalary",
          name: "ფინანსები ხელფასით",
          url: "http://jobs.ge/?page=1&keyword=&cat=finance&location=&view=&with_salary=yes",
          fb: "finance",
          hasSalary: true,
        }, {
          id: "itWithoutSalary",
          name: "IT With Salary",
          url: "http://www.jobs.ge/?page=1&keyword=&cat=it&location=&view=",
          fb: "it"
        }, {
          id: "itWithSalary",
          name: "IT With Salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=it&location=&view=&with_salary=yes",
          fb: "it",
          hasSalary: true
        }, {
          id: "technicalWithSalary",
          name: "Technical and logistics with salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=technical&location=&view=&with_salary=yes",
          fb: "technical",
          hasSalary: true
        }, {
          id: "technicalWithoutSalary",
          name: "Technical and logistics without salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=technical&location=&view=",
          fb: "technical"
        }, {
          id: "salesWithoutSalary",
          name: "Sales Without Salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=sales&location=&view=",
          fb: "sales"
        }, {
          id: "salesWithSalary",
          name: "Sales With Salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=sales&location=&view=&with_salary=yes",
          fb: "sales",
          hasSalary: true
        }, {
          id: "legalWithoutSalary",
          name: "Legal Without Salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=law&location=&view=",
          fb: "legal"
        }, {
          id: "legalWithSalary",
          name: "Legal With Salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=law&location=&view=&with_salary=yes",
          fb: "legal",
          hasSalary: true
        }, {
          id: "healthcareWithoutSalary",
          name: "healthcare Without Salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=healthcare&location=&view=",
          fb: "healthcare"
        }, {
          id: "healthcareWithSalary",
          name: "healthcare With Salary",
          url: "http://jobs.ge/?page=1&keyword=&cat=healthcare&location=&view=&with_salary=yes",
          fb: "healthcare",
          hasSalary: true
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
            var mergedResults = utils.mergeWithCompositeID(combinedArrays)
            resolve(mergedResults);
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
                link: $(d).find('a').map((i, l) => 'http://www.jobs.ge' + $(l).attr('href'))[0],
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
              type: category.fb,
              hasSalary: category.hasSalary,
              createdAt: new Date()
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

function salaryCrawler(item, callback) {
  console.log(`crawling ${item} for salary`)
  var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;
        var salary = $.text().split(/\n/g).filter(d => d.indexOf('ნაზღ') != -1 || d.indexOf('ხელფას') != -1 || d.indexOf('ლარი') != -1);
        if (typeof callback == 'function') {
          callback(salary);
        }
      }
      done();
    }
  })
  c.queue(item.link);
}

scraper.updateSalaries = function () {
  var db = mdao.getDB();
  return new Promise((resolve, reject) => {
    updateSalary();
    var interval = setInterval(updateSalary, 10000);
    function updateSalary() {

      //get job, where salary is not scraped yet
      db.jobs.findOne({ hasSalary: true, scrapedForSalary: { $ne: true } }, (err, item) => {
        console.log('Trying to load salary for ', item);
        if (err) {
          console.log(err);
          clearInterval(interval);
          return;
        }
        if (!item) {
          clearInterval(interval);
          console.log('Done!');
          resolve('done');
          return;
        }

        salaryCrawler(item, function (salary) {
          console.log('salary crawled, updating item')
          if (salary.length) {
            item.salary = salary.join('\r\n')
          }
          item.scrapedForSalary = true;
          mdao.updateItem(item);
        })
      });
    }
  })
}





module.exports = scraper;