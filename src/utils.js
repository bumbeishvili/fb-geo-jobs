require('./prototypes.js');

var utils = {};

utils.getAccessToken = function (item) {
  var tokenName = item.type + "AccessToken";
  if (process.env[tokenName]) {
    return process.env[tokenName];
  } else {
    var secret = require('./secretGitIgnore');
    return secret[tokenName];
  }

}

utils.htmlfy = function (items) {

  var postedCount = 100;
  var notPosted = 40;
  var notInserted = 30;

  return `
      <h1>Posting status </h1>
      posted ${postedCount} <br>
      notPosted ${notPosted}

      <h1>Insert status </h1>
      not inserted ${notInserted}`;
};

utils.cleanStrings = function (obj) {
  if (!obj) return;
  var keys = Object.keys(obj);
  keys.forEach(k => {
    obj[k] = utils.cleanString(obj[k])
  })
  return obj;
}
utils.cleanString = function (string) {
  if (typeof string != 'string') return string;
  if (!string) return string;
  return string.trim();
}

utils.combineArrays = function (arrOfarrs) {
  return arrOfarrs.reduce((a, b) => a.concat(b));
}

utils.setCompositeID = function (obj) {
  obj.compositeID = obj.link;
  if (obj.createDate) {
    obj.createDate = new Date();
  }
}

utils.mergeWithCompositeID = function (arr) {
  console.log('started merging of ' + arr.length + " item");
  var grouped = arr.$groupBy(['compositeID']);
  console.log('successfully grouped ' +grouped.length + " item");
  var result = grouped.map(d => {
    var res;
    d.values.forEach(obj => {
      if (!res) {
        res = obj;
      }
      if (!res.hasSalary) {
        res.hasSalary = obj.hasSalary
      }
    })
    return res;
  });
  return result;
}

module.exports = utils;
