var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var collection = db.get('movies');
	url = 'http://www.imdb.com/title/tt0838283/';
		
	request(url, function(error, response, html){

	if(!error){

	var $ = cheerio.load(html);
	
	var title, release, rating;
	var json = { title : "", release : "", rating : ""};
	
	$('.header').filter(function(){
	var data = $(this);
	title = data.children().first().text();
	release = data.children().last().children().text();
	json.title = title;
	json.release = release;
	})
	$('.star-box-giga-star').filter(function(){
		var data = $(this);
		rating = data.text();
		json.rating = rating;
	})
	}

	fs.appendFile('output.json', JSON.stringify(json, null, 4), function(err){
		console.log('File successfully written! - Check your project directory for the output.json file');
	})
	
	collection.insert(json, function(err,doc){if(err){res.send("There was a problem adding the information to the database.")}});
	})

	res.render('scrape', { title: 'IMDB scraped !' });
});

module.exports = router;
