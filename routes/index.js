var cheerio = require('cheerio');
var express = require('express');
var router = express.Router();
var http = require('http');
var SummaryTool = require('node-summary');

/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
		});

router.get('/form', function(req,res,next){
		res.send('<form method="post" action="/">' +
			'<input type="hidden" name="_method" value="put" />' +
			'Your Query: <input type="text" name="query" />' +
			'<input type="submit" />' +
			'</form>');
		//res.send('kalidas');

		});

router.post('/', function(req, res, next) {
		var query = req.body.query;
		var tokens = query.split(" ");
		for(var i=0; i<tokens.length; i++){
		tokens[i] = tokens[i][0].toUpperCase() + tokens[i].slice(1).toLowerCase();
		}
		var query_clean = tokens.join("_");


		var url = 'http://en.wikipedia.org/wiki/' +  query_clean;
		
		var para1;
		var para2;

		var content;
		var json = { content : ""};
		//console.log(url);
		function download(url, callback) {
		http.get(url, function(res) {
			var data = "";
			res.on('data', function (chunk) {
				data += chunk;
				});
			res.on("end", function() {
				callback(data);
				});
			}).on("error", function() {
				callback(null);
				});
		}




		download(url, function(data) {
				if (data) {
				var $ = cheerio.load(data);
				$('#mw-content-text').find('p').first().filter(function(){
						var data = $(this);
						//content = data.children().first().text();
						para1 = data.text();
						});

				$('#mw-content-text').find('p').eq(1).filter(function(){
						var data = $(this);
						para2 = data.text();
						
				});
//console.log(para1);
//console.log(para2);
				SummaryTool.summarize(para1,para2, function(err, summary) {
						if(err) console.log("Summarization went wrong !");

						console.log(summary);

						console.log("Original Length " + (para1.length + para2.length));
						console.log("Summary Length " + summary.length);
						json.content=summary;
						});			

				
				res.send(json);

			//	console.log(json);				
				//console.log("done");
				}
				})
		})





		module.exports = router;
