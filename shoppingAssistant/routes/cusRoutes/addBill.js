var accountSid = 'ACf45a3674f16f51148900132024c460a3'; 
var authToken = '8446627e5a4b458facedb6d8b38620a1'; 
var mysql = require('../mysql');
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
var imageToTextDecoder = require('image-to-text');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var busboy = require('connect-busboy');
var request = require('request');
var cheerio = require('cheerio');



/*GET ADD BILL PAGE*/
exports.addBill = function(req, res){
	if (req.session.username) {
		res.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var json_responses = {
			"user" : req.session.username,
		};
		 var restaurentUrl=req.param("restaurentURL");
		 var restaurentChoice=req.param("restaurentChoice");
		  var url = 'http://www.imdb.com/title/tt1229340/';

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

		                //json.title = title
		                console.log("Movie title: "+data);
		                res.render('Customer/addBill',{"abc":restaurentChoice, "text": data});
		            })
		        }
		        else{
		        	console.log("Error while extracting");
		        }
		    })
		
	
	}
	else{
		res.render('Customer/customerLogin',{"status":1});
	}
};



exports.postBillDetails = function( req, res){
	 
	
	
	var fstream;
    //req.pipe(req.busboy);
    
    /*req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(__dirname + '../image/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Closed");
        });
    }); 
	*/
	
	/* var key = 'anXOalkh6YW3rWy-FAoOZw'; //Your key registered from cloudsightapi @ https://cloudsightapi.com 
	 imageToTextDecoder.setAuth(key);
	 imageToTextDecoder.getKeywordsForImage(file).then(function(keywords){
	    console.log(keywords);
	 },function(error){
	    console.log(error);
	 });
	*/
	console.log("Req body...."+req.body.billNum);
	var points=0;
	var billNum=req.body.billNum;
	var totalCost=req.body.totalCost;
	var restaurentChoice=req.body.restaurentChoice;
	restaurentChoice = restaurentChoice.replace('\'','');
	console.log("Taken from sessioncustomerID: "+req.session.customerId);
	var insertIntoQuery = "insert into billing  (bill_no, cust_id, vendor_name, cost) values ('"+billNum+"', '"+req.session.customerId+"', '"+restaurentChoice+"', '"+totalCost+"')";
	if(totalCost<=5){
		points=100;
	}
	if(totalCost>5&& totalCost<=15){
		points=200;
	}
	if(totalCost>15 && totalCost<=30){
		points=300;
	}
	if(totalCost>30&& totalCost<=60){
		points=400;
	}
	if(totalCost>60 && totalCost<=100){
		points=500;
	}
	if(totalCost>100){
		points=1000;
	}
	console.log("The current users userid: "+req.session.customerId);
	var getPointsQuery="SELECT points from points where id='"+req.session.customerId+"'";
	
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			mysql.fetchData(function(err, results) {
				if (err) {
					throw err;
				} else {
					console.log("Get points query..");
					var jsonString1= JSON.stringify(results);
					var passParsed= JSON.parse(jsonString1);
					points=points+passParsed[0].points;
					var updatePointsQuery="UPDATE points SET points='"+points+"' WHERE id='"+req.session.customerId+"'";
					console.log("Getting the users existing points...: "+jsonString1);
					mysql.fetchData(function(err, results) {
						if (err) {
							throw err;
						} else {
							console.log("Updating the existing points with new points...:"+points);
							client.messages.create({
							to: "+15102039956", 
							from: "+16692316114",
							body: "From RestoAssist: Hello,"+points+" points are added to your account",  
						}, function(err, message) { 
							console.log(message); 
						}); 
							res.redirect('/myPoints');
						}
					}, updatePointsQuery);
				}
			}, getPointsQuery);
		}
	}, insertIntoQuery);
	
};