var FB = require('fb');
var mdao = require('./mdao.js');
var utils = require('./utils.js');
var express = require('express');
var router = express.Router();



var fbApi = {};

var statuses = {
  processing: "processing",
  idle: "idle"
}
var status = statuses.idle;




fbApi.startPosting = function (unposted) {
  var db = mdao.getDB();
  console.log('got db')
  return new Promise((resolve, reject) => {
    var filteredTypes = [];
    post();
    var interval = setInterval(post, 60000)

    function post() {
      //get job, which was not posted yet
      db.jobs.findOne({ posted: { $ne: true }, type: { $nin: filteredTypes } }, (err, item) => {
        console.log('Trying to post ', item);
        if (err) {
          console.log(err);
          clearInterval(interval);
          return;
        }
        if (!item) {
          clearInterval(interval);
          status = statuses.idle;
          console.log('Done!');
          resolve('done');
        }
        postToFB(item, filteredTypes);
      });
    }

  }); //end of promise
}// end of function


function postToFB(item, filteredTypes) {
  FB.setAccessToken(utils.getAccessToken(item));
  var fbPost = {
    message: `${item.company}\r\n ბოლო ვადა ${item.validTill}`,
    link: item.link,
    name: item.pos
  }
  var body =
    FB.api('me/feed', 'post', fbPost, function (res) {
      if (!res || res.error) {
        filteredTypes.push(repo.type);
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('New Post - : ', res.id, ' - ');
      mdao.setAsPosted(item);
    });
}



// For extended access token
router.get('/extendAccessToken/:appId/:appSecret/:token', function (req, nodeRes, next) {
  const client_id = req.params.appId;
  const client_secret = req.params.appSecret;
  const existing_access_token = req.params.token;
  FB.api('oauth/access_token', {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: 'fb_exchange_token',
    fb_exchange_token: existing_access_token
  }, function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      nodeRes.send('error + ' + res.error.message);
      return;
    }
    nodeRes.send('success - ' + res.access_token);
    var accessToken = res.access_token;
    var expires = res.expires ? res.expires : 0;
  });
});


module.exports = fbApi;
