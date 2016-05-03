//'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 
var Promise = require('bluebird');

module.exports = router;

router.get('/', function(req, res, next) {
	Page.findAll().then(function(pagesFound){
		var tempArr=[];
		for (var i=0;i<pagesFound.length;i++){
			tempArr.push(pagesFound[i]['dataValues']['urlTitle']);
		}
		res.render('index',{pages: tempArr});
	})
});

router.post('/', function(req, res, next) {
	User.findOrCreate({
	  where: {
	    name: req.body.name,
	    email: req.body.email
	  }
	})
	.then(function (values) {
	  var user = values[0];
	  var page = Page.build({
	    title: req.body.title,
	    content: req.body.content,
	    tags: req.body.tags
	  });

	  return page.save().then(function (page) {
	    return page.setAuthor(user);
	  });
	})
	.then(function (page) {
	  res.redirect(page.routePath);
	})
	.catch(next);
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.get('/users', function(req, res, next) {
  User.findAll({}).then(function(users){
    res.render('users', { users: users });
  }).catch(next);
});

router.get('/users/:userId', function(req, res, next) {
  var userPromise = User.findById(req.params.userId);
  var pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });
  Promise.all([
    userPromise, 
    pagesPromise
  ])
  .then(function(values) {
    var user = values[0]['dataValues'];
    var pages = values[1];
    res.render('indivusers', { user: user, pages: pages });
  })
  .catch(next);
});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({ 
    where: { 
      urlTitle: req.params.urlTitle 
    } 
  })
  .then(function(foundPage){
    console.log("David: ",foundPage);
  	User.findOne({ 
    where: { 
      id: foundPage['authorId'] 
    } 
  }).then(function(author){
  	res.render('wikipage', {
       title: foundPage['title'],
       authorURL: 'there is no author field',
       tags: 'there is no tags field',
       author: author['name'],
       content: foundPage['content'],
       tags: foundPage['tags'].join(" "),
  })
	
   });
  })
  .catch(next);
});






















