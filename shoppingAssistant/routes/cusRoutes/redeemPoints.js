var mysql = require('../mysql');
exports.getMyPoints = function(req, res){
	if (req.session.username) {
		res.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var json_responses = {
			"user" : req.session.username,
		};
		
	
		var getPointsQuery="SELECT points from points where id='"+req.session.customerId+"'";
		
		
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				var jsonString1= JSON.stringify(results);
				var passParsed= JSON.parse(jsonString1);
				console.log("In my points controller and the customer's points are :"+passParsed[0].points);
				res.render('Customer/myPoints', {"myPoints":passParsed[0].points});
			}
		}, getPointsQuery);
	}
	
	else{
		res.render('Customer/customerLogin',{"status":1});
	}
	
};