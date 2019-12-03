var express = require('express');
var router = express.Router();
const fs = require('fs');
const testFolder = './views/images/';
const user = require('./user.json');
const path = require('path');


/* GET home page. */
router.get('/dashboard', requireLogin, function (req, res, next) {
  let filenameArray = [];
  console.log(req.session.user, "uuuu");
  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
      filenameArray.push(file);
    });
  });
  res.render('index', { title: 'Welcome to the Food Gallery', condition: true, anyArray: filenameArray, username: req.session.user.username });
});


router.post('/dashboard', requireLogin, (req, res) => {
  console.log(req.body);
  console.log("inside");
  tempFileName = req.body.id;
  imagepath = path.join(tempFileName);
  let imagesArr = [];
  let filenameArray = [];
  imagesArr.push(imagepath);
  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
      filenameArray.push(file);
    });
  });
  res.render('index', { title: 'Welcome', image: true, images: imagesArr, anyArray: filenameArray, username: req.session.user.username });
})



router.get('/', function (req, res, next) {
  res.render('login', {
    'title': 'Login'
  });
});

router.post('/', (req, res) => {
  let error = '';

  if (user.hasOwnProperty(req.body.username)) {
    if (user[req.body.username] == req.body.password) {
      let userobj = {};
      userobj.username = req.body.username;
      userobj.password = req.body.password;
      console.log(userobj, "<<<<");
      req.session.user = userobj;
      console.log(req.session, "sess");
      res.redirect('/dashboard');
    } else {
      error = 'Incorrect password';
      res.render('login', {
        'title': 'Login',
        errors: error
      });
    }
  } else {
    error = 'Not a registered username';
    res.render('login', {
      'title': 'Login',
      errors: error
    });
  }

})


router.get('/logout', function (req, res) {
  req.session.reset();
  res.redirect('/');
});


function requireLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};


module.exports = router;
