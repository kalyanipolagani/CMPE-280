var mysql = require('../mysql');
var passwordHash = require('password-hash');


/*GET LOGIN PAGE*/
exports.getCustLoginPage = function(req, res){
	var status=req.param("status");
	res.render('Customer/customerLogin',{"status": status});
};


/*POST LOGIN DETAILS*/
exports.checkCustLoginDetails = function(req, res){
	var username, password;
	username = req.body.userid;
	password = req.body.password;
	var selectPassQuery = "select cust_pass, cust_id from customer where cust_email= '"+ username +"'";
	var json_responses;
	
	mysql.fetchData(
			function(err, results) {
				if (err) {
					throw err;
				} else {
					if (results.length > 0) {
						console.log("Password found :"+results);
						var jsonString1= JSON.stringify(results);
						var passParsed= JSON.parse(jsonString1);
						console.log("This is the found password: "+passParsed[0].cust_pass);
						console.log("This is the customer id: "+passParsed[0].cust_id);
						if(passwordHash.verify(password, passParsed[0].cust_pass))
						{
							req.session.username = username;
							req.session.customerId=passParsed[0].cust_id;
						    console.log("Session initialized");
						    json_responses = {"statusCode" : 200};
						    res.redirect('/redirectToHomePage');
						}
						else{
							console.log("Password not matched");
							json_responses = {"statusCode" : 401};
							//var string = encodeURIComponent('something that would break');
							var status=0;
							res.redirect('/customerLogin/?status='+status);
						}
					}
					else{
						console.log("Username not present");
						json_responses = {"statusCode" : 401};
						res.redirect('/');
						res.send(json_responses);
					}
				}
				
			}, selectPassQuery);
};



/*LOGOUT*/
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};
