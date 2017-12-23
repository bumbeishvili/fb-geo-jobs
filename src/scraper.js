var Crawler = require('crawler');
var querystring = require('querystring');
var request = require('request');
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
          id: "prWithoutSalary",
          name: "pr",
          url: "http://jobs.ge/?page=1&keyword=&cat=prmarketing&location=&view=",
          fb: "pr",
        }, {
          id: "fprWithSalary",
          name: "pr ხელფასით",
          url: "http://jobs.ge/?page=1&keyword=&cat=prmarketing&location=&view=&with_salary=yes",
          fb: "pr",
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
    }, {
      siteName: 'www.work.ge',
      scrapingMethod: 'workge',
      categories: [
        {
          id: "itWithSalaryWorkGe",
          name: "work.ge - it With Salary",
          url: "https://work.ge/category/it_dizaini_interneti_media",
          fb: "it",
          hasSalary: true
        }, {
          id: "financeWithSalaryWorkGe",
          name: "work.ge - finance With Salary",
          url: "https://work.ge/category/finance_accounting_audit",
          fb: "finance",
          hasSalary: true
        }, {
          id: "dacvaWithSalaryWorkGe",
          name: "work.ge - dacva With Salary",
          url: "https://work.ge/category/dacva_usafrtkhoeba",
          fb: "technical",
          hasSalary: true
        }, {
          id: "logWithSalaryWorkGe",
          name: "work.ge - log With Salary",
          url: "https://work.ge/category/dacva_usafrtkhoeba",
          fb: "technical",
          hasSalary: true
        }, {
          id: "healthWithSalaryWorkGe",
          name: "work.ge - health With Salary",
          fb: "healthcare",
          url: "https://work.ge/category/health-care_medicine_Pharmaceuticals",
          fb: "healthcare",
          hasSalary: true
        }, {
          id: "salesWithSalaryWorkGe",
          name: "work.ge - sales With Salary",
          url: "https://work.ge/category/gakidvebi",
          fb: "sales",
          hasSalary: true
        }, {
          id: "legalWithSalaryWorkGe",
          name: "work.ge - legal With Salary",
          url: "https://work.ge/category/iurisprudencia",
          fb: "legal",
          hasSalary: true
        }, {
          id: "marketingWithSalaryWorkGe",
          name: "work.ge - marketing With Salary",
          url: "https://work.ge/category/marketingi_reklama_pr",
          fb: "pr",
          hasSalary: true
        }, {
          id: "technicalWithSalaryWorkGe",
          name: "work.ge - technical real With Salary",
          url: "https://work.ge/category/construction-real-estate",
          fb: "technical",
          hasSalary: true
        }
      ]
    }, {
      siteName: 'www.hr.gov.ge',
      scrapingMethod: 'hrgov',
      categories: [
        {
          id: "itWithSalaryHrGovGe",
          name: "hrGov.ge - it With Salary",
          url: "https://www.hr.gov.ge/?vacansyNum=12",
          fb: "it",
          hasSalary: true
        }, {
          id: "financeWithSalaryHrGovGe",
          name: "hrGov.ge - finance With Salary",
          url: "https://www.hr.gov.ge/?vacansyNum=76",
          fb: "finance",
          hasSalary: true
        }, {
          id: "auditWithSalaryHrGovGe",
          name: "hrGov.ge - audit With Salary",
          url: "https://www.hr.gov.ge/?vacansyNum=2",
          fb: "finance",
          hasSalary: true
        }, {
          id: "legalWithSalaryHrGovGe",
          name: "hrGov.ge - legal With Salary",
          url: "https://www.hr.gov.ge/?vacansyNum=10",
          fb: "legal",
          hasSalary: true
        }
      ]
    }, {
      siteName: 'www.myjobs.ge',
      scrapingMethod: 'myjobs',
      categories: [
        {
          name: "myjobs it",
          vacancyLinkTemplate: "https://www.myjobs.ge/ka/vacancy?vac_id=",
          urlTemplate: "https://www.myjobs.ge/block/daily_vacancies.php",
          cat_id: 1,
          fb: "it",
          hasSalary: true
        }, {
          name: "myjobs legal",
          vacancyLinkTemplate: "https://www.myjobs.ge/ka/vacancy?vac_id=",
          urlTemplate: "https://www.myjobs.ge/block/daily_vacancies.php",
          cat_id: 14,
          fb: "legal",
          hasSalary: true
        }, {
          name: "myjobs pr",
          vacancyLinkTemplate: "https://www.myjobs.ge/ka/vacancy?vac_id=",
          urlTemplate: "https://www.myjobs.ge/block/daily_vacancies.php",
          cat_id: 5,
          fb: "pr",
          hasSalary: true
        }, {
          name: "myjobs healthcare",
          vacancyLinkTemplate: "https://www.myjobs.ge/ka/vacancy?vac_id=",
          urlTemplate: "https://www.myjobs.ge/block/daily_vacancies.php",
          cat_id: 6,
          fb: "healthcare",
          hasSalary: true
        }, {
          name: "myjobs realties",
          vacancyLinkTemplate: "https://www.myjobs.ge/ka/vacancy?vac_id=",
          urlTemplate: "https://www.myjobs.ge/block/daily_vacancies.php",
          cat_id: 7,
          fb: "technical",
          hasSalary: true
        }, {
          name: "myjobs finances,accounting , banking",
          vacancyLinkTemplate: "https://www.myjobs.ge/ka/vacancy?vac_id=",
          urlTemplate: "https://www.myjobs.ge/block/daily_vacancies.php",
          cat_id: 24,
          fb: "finance",
          hasSalary: true
        }
      ]
    }
  ]
}

scraper.scrapingMethods = {
  jobsge: jobsGeCrawler,
  workge: workGeCrawler,
  hrgov: hrGovGeCrawler,
  myjobs: myJobsCrawler
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
          console.log(`Left   ${total - counter} response`);
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



function myJobsCrawler(category, callback) {
  var form = {
    cat_id: category.cat_id
  };

  var formData = querystring.stringify(form);
  var contentLength = formData.length;

  //   name: "myjobs it",
  //     vacancyLinkTemplate: "https://www.myjobs.ge/ka/vacancy?vac_id=",
  //       urlTemplate: "https://www.myjobs.ge/block/daily_vacancies.php",
  //         cat_id: 1,
  //           fb: "it",
  //             hasSalary: true
  // }

  request({
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    uri: category.urlTemplate,
    body: formData,
    method: 'POST'
  }, function (err, res, body) {
    var result = JSON.parse(body).vacancies.map(d => {
      return {
        site: 'myjobs.ge',
        postedOn: d.date[0] + " / " + d.date[1],
        validTill: d.date[2] + " / " + d.date[3],
        type: category.fb,
        hasSalary: d.salary ? true : null,
        createdAt: new Date(),
        pos: d.vac_title,
        company: d.comp_title,
        salary: d.salary ? d.salary : null,
        scrapedForSalary: d.salary ? true : null,
        link: category.vacancyLinkTemplate + d.id,
      }

    })

    if (typeof callback == 'function') {
      callback(result);
    }

  });


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


function hrGovGeCrawler(category, callback) {
  var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;
        var jobs = $('#activeVaks tbody tr')
          .map((i, d) => $(d).find('td'))
          .map((i, d) => {
            return {
              site: 'hr.gov.ge',
              link: "https://www.hr.gov.ge" + $(d[1]).find('a').attr('href'),
              salary: null,
              pos: $(d[1]).text().trim(),
              company: $(d[2]).text().trim(),
              postedOn: null,
              validTill: $(d[3]).text().trim(),
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


function workGeCrawler(category, callback) {
  var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;


        var jobs = $('.data-list .data-row')
          .map((i, d) => $(d).find('.data-cell'))
          .filter(i => i > 0)
          .map((i, d) => {
            return {
              site: 'work.ge',
              link: $(d[0]).find('a').attr('href'),
              salary: "ანაზღაურება " + $(d[2]).text().trim() + " ლარი ",
              pos: $(d[0]).text().trim(),
              company: $(d[1]).text().trim(),
              postedOn: $(d[4]).text().trim(),
              validTill: $(d[4]).text().trim(),
              type: category.fb,
              hasSalary: category.hasSalary,
              scrapedForSalary: true,
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