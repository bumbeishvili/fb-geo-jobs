var mongojs = require('mongojs');
require('./prototypes.js');

var mdao = {};


mdao.getDB = function getDB() {
  var db;
  if (process.env.mongoDBConnection) {
    db = mongojs(process.env.mongoDBConnection);
  } else {
    var secret = require('./secretGitIgnore');
    db = mongojs(secret.mongoDBConnection);
  }
  return db;
}

mdao.filterNewJobs = function (scrapedData) {
  var db = mdao.getDB();
  return new Promise((resolve, reject) => {
    db.jobs.find(function (err, dbData) {
      var ids = dbData.map(item => item.compositeID);
      var newData = scrapedData.filter(scrapedItem => {
        return ids.indexOf(scrapedItem.compositeID) == -1;
      })
      resolve(newData);
    }) // end of find
  }); //end of promise
}

mdao.insertNewJobs = function (newData) {
  var db = mdao.getDB();
  return new Promise((resolve, reject) => {
    debugger;
    db.jobs.insert(newData, () => {
      resolve('inserted')// end of find
    }); //end of insert
  }); //end of promise
}// end of function

mdao.loadUnposted = function () {
  var db = mdao.getDB();
  return new Promise((resolve, reject) => {
    db.jobs.find({ posted: { $ne: true } }, (err, unposted) => {
      resolve(unposted);
    });// end of db access
  }); //end of promise
}// end of function


mdao.updateItem = function (item) {
  var db = mdao.getDB();
  return new Promise((resolve, reject) => {
    db.jobs.update({ "_id": item._id }, item, function () {
      resolve(item);
    });
  }); //end of promise
}



mdao.getUnpostedWithSalaryStatistics = function () {
  var db = mdao.getDB();
  return new Promise((resolve, reject) => {
    db.jobs.find({ posted: { $ne: true }, hasSalary: true, }, (err, unposted) => {
      var stats = {
        total: unposted.length,
        scrapedForSalary: unposted.filter(d => d.scrapedForSalary).length,
        details: unposted.$groupBy(['type']).map(d => { return { name: d.type, count: d.values.length,values:d.values } })
      }
      resolve(stats);
    });// end of db access
  }); //end of promise
}// end of function

mdao.getAllItems = function () {
  var db = mdao.getDB();
  return new Promise((resolve, reject) => {
    db.jobs.find((err, allItems) => {
      resolve(allItems);
    });// end of db access
  }); //end of promise
}// end of function


module.exports = mdao;
