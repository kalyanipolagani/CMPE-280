var request = require('request');
var cheerio = require('cheerio');

exports.searchRestaurents = function(req, res){
  
	if (req.session.username) {
		res.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var json_responses = {
			"user" : req.session.username,
		};
	
	var Yelp = require('yelp');
	 
	var yelp = new Yelp({
	  consumer_key: '7vLzDnZHyYvWg_cU2Py39Q',
	  consumer_secret: 'Npv_bLKHX7akdJ-blHfB53DholA',
	  token: 'DWT-7vLiyMkWeFkp2jqk8R3OMeTgGul5',
	  token_secret: 'tArD_HGYsluoOVQuJaWK131GjFs',
	});
	resData={};
	console.log("Session in customer username: ......."+req.session.username);
	console.log("Session in customer id: ......."+req.session.customerId);
	var distance=req.body.distance;
	var cuisine=req.body.cuisine;
	var location=req.body.location;
	console.log("-------1111111------");
	console.log(distance);
		/*term: cuisine, location : location, radius_filter: "4000", limit: '10' */
		/*Yelp search*/
	console.log(cuisine);
	yelp.search({ term: cuisine, location : location, radius_filter: '4000', limit: '20' })
	.then(function (data) {
		resData=data;
	  console.log(JSON.stringify(data));
	  var jsonParse1=JSON.parse(JSON.stringify(data));
	  console.log("-------------------");
	  console.log(jsonParse1.businesses[0].name+"  "+jsonParse1.businesses[0].url+" "+jsonParse1.businesses[0].rating+" "+jsonParse1.businesses[0].image_url+" "+jsonParse1.businesses[0].rating_img_url_small);
	  
	  /*var url = 'http://www.imdb.com/title/tt1229340/';

	    request(url, function(error, response, html){
	       console.log("Inside, response: "+html);
	    	if(!error){
	    		console.log("Very inside");
	            var $ = cheerio.load(html.toString());
	            var title, release, rating;
	            var json = { title : "", release : "", rating : ""};
	            // We'll use the unique header class as a starting point.
	            
	            
	            $('.summary_text').filter(function(){
	            	console.log("Inside header filtering");
	           // Let's store the data we filter into a variable so we can easily see what's going on.
	                var data = $(this);

	           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
	           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

	               // title = data.children().first().text();
	                data=data.text();
	           // Once we have our title, we'll store it to the our json object.

	                //json.title = title;
	                console.log("Movie title: "+data);
	            })
	        }
	        else{
	        	console.log("Error while extracting");
	        }
	    })
*/	  
	  res.render('Customer/searchResults',{obj: jsonParse1, "location":location});
	});
	}
	else{
		res.render('Customer/customerLogin',{"status":1});
	}
};