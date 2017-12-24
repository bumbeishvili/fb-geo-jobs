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
  console.log('successfully grouped ' + grouped.length + " item");
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




utils.setFlags = function (newItems) {
  return new Promise((resolve, reject) => {
    newItems.forEach(utils.setFlag);
    return resolve(newItems);
  }); //end of promise
};

utils.setFlag = function (d) {
  if (isProgrammer(d)) { d.isProgrammer = true; };
  if (isAccountant(d)) { d.isAccountant = true; }
  setSalary(d);
};

function isProgrammer(job) {
  var isProg = false;
  var checkWords = ['პროგრამისტ', 'დეველოპერ', 'python', 'javascript', '.net', 'php'];
  for (var i = 0; i < checkWords.length; i++) {
    if (job.pos != null && job.pos.indexOf(checkWords[i]) != -1) {
      isProg = true;
      break;
    }
  }
  return isProg;
}

function isAccountant(job) {
  var is = false;
  var checkWords = ['IFRS', 'ბუღალტ', 'აუდიტ', 'ანგარიშგებ', 'აღრიცხ', 'ფინანს'];
  for (var i = 0; i < checkWords.length; i++) {
    if (job.pos != null && job.pos.indexOf(checkWords[i]) != -1) {
      is = true;
      break;
    }
  }
  return is;
}

function setSalary(obj) {
  if (obj.hasSalary && obj.salary) {
    var salaries = obj.salary.match(/[\d,\, ]+/g)
      .map(m => m.trim())
      .map(m => m.replace(/[\,,\s]/g, ""))
      .filter(m => m)
      .map(p => parseInt(p));
    obj.maxSalary = salaries.$max();
    obj.minSalary = salaries.$min();
  }
}


module.exports = utils;
