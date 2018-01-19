var fbApi = {};
var FB = require('fb');
var mdao = require('./mdao.js');
var utils = require('./utils.js');
var express = require('express');
fbApi.router = express.Router();



fbApi.startPosting = function (unposted) {
  var db = mdao.getDB();
  console.log('got db')
  return new Promise((resolve, reject) => {
    var filteredTypes = [];
    post();
    var interval = setInterval(post, 60000)

    function post() {
      //get job, which was not posted yet
      db.jobs.findOne({ scrapedForSalary: true, maxSalary:{ $gt: 0 } , posted: { $ne: true }, type: { $nin: filteredTypes } }, (err, item) => {
        console.log('Trying to post ', item);
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

        if (item.isAccountant && !item.isAccPosted && item.maxSalary >= 1000) {
          postToAccJob(item, filteredTypes);
        } else if (item.isProgrammer && !item.isDevPosted && item.maxSalary >= 1500) {
          postToDevJob(item, filteredTypes);
        } else if (item.maxSalary >= 3000 && !item.isTopPosted) {
          postToTopJob(item, filteredTypes);
        } else if (!item.posted) {
          postToFB(item, filteredTypes);
        }

      });
    }

  }); //end of promise
}// end of function

function postToDevJob(item, filteredTypes) {
  FB.setAccessToken(utils.getAccessToken({ "type": 'programming' }));
  var fbPost = {
    message: (item.salary ? (item.salary + "\r\n") : "") + `${item.pos} \r\n ${item.company}\r\n ბოლო ვადა ${item.validTill}`,
    link: item.link,
    name: item.pos.slice(0, 50)
  }
  var body =
    FB.api('me/feed', 'post', fbPost, function (res) {
      if (!res || res.error) {
        filteredTypes.push(item.type);
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('New Post - : ', res.id, ' - ');
      item.isDevPosted = true;
      mdao.updateItem(item);
    });
}

// todo refactor and make one func from these 4
function postToTopJob(item, filteredTypes) {
  FB.setAccessToken(utils.getAccessToken({ "type": 'top' }));
  var fbPost = {
    message: (item.salary ? (item.salary + "\r\n") : "") + `${item.pos} \r\n ${item.company}\r\n ბოლო ვადა ${item.validTill}`,
    link: item.link,
    name: item.pos.slice(0, 50)
  }
  var body =
    FB.api('me/feed', 'post', fbPost, function (res) {
      if (!res || res.error) {
        filteredTypes.push(item.type);
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('New Post - : ', res.id, ' - ');
      item.isTopPosted = true;
      mdao.updateItem(item);
    });
}



function postToAccJob(item, filteredTypes) {
  FB.setAccessToken(utils.getAccessToken({ "type": 'accounting' }));
  var fbPost = {
    message: (item.salary ? (item.salary + "\r\n") : "") + `${item.pos} \r\n ${item.company}\r\n ბოლო ვადა ${item.validTill}`,
    link: item.link,
    name: item.pos.slice(0, 50)
  }
  var body =
    FB.api('me/feed', 'post', fbPost, function (res) {
      if (!res || res.error) {
        filteredTypes.push(item.type);
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('New Post - : ', res.id, ' - ');
      item.isAccPosted = true;
      mdao.updateItem(item);
    });
}



function postToFB(item, filteredTypes) {
  FB.setAccessToken(utils.getAccessToken(item));
  var fbPost = {
    message: (item.salary ? (item.salary + "\r\n") : "") + `${item.pos} \r\n ${item.company}\r\n ბოლო ვადა ${item.validTill}`,
    link: item.link,
    name: item.pos.slice(0, 50)
  }
  var body =
    FB.api('me/feed', 'post', fbPost, function (res) {
      if (!res || res.error) {
        filteredTypes.push(item.type);
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('New Post - : ', res.id, ' - ');
      item.posted = true;
      mdao.updateItem(item);
    });
}



// For extended access token
fbApi.router.get('/extendAccessToken/:appId/:appSecret/:token', function (req, nodeRes, next) {
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
