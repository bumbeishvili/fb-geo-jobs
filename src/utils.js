var utils = {};

utils.htmlfy = function(items) {

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


module.exports = utils;