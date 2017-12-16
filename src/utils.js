var utils = {};

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


module.exports = utils;