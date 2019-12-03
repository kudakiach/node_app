var express = require('express');
var router = express.Router();
const fs = require('fs');
const testFolder = './public/images/';
const user = require('./user.json');
const path = require('path');
const mongoose = require('mongoose');
//const db = require("../model/db.js");

mongoose.connect('mongodb://localhost:27017/',{useNewUrlParser:true},(err) => {
  if(!err){
    console.log('mongodb connected')
  }else{ console.log(' connection error')}
})

var gallerySchema = new mongoose.Schema({
  filename:{
    type:String,
    required:'This field is required'
  },
  description:{
    type:String,
    required:'This field is required'
  },
  price:{
    type:Number,
    required:'This field is required'
  },
  status:{
    type:String,
    required:'This field is required'
  }
})
galleryModel= mongoose.model('gallery', gallerySchema);


router.get('/addFile', function(req,res){
  res.render('add',{title:'add gallery'})
})

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
      res.redirect('/gallery');
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

// read product data from mongoDB atlas
router.get('/gallery', function(req, res){
  galleryModel.find((err, docs) =>{
    if(err){
      console.log("error retirievinf data")
    }else{
     console.log(docs)
    }
  })
})




module.exports = router;
