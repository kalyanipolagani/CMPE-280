var mysql = require('../mysql');
var passwordHash = require('password-hash');

/*GET CUSTOMER SIGNUP PAGE*/
exports.getCustSignUpPage = function(req, res){
  
	res.render('Customer/customerSignup');
};


/*POST CUSTOMER DETAILS*/
exports.postSignUpDetails = function(req, res){  
	var fname = req.body.FirstName;
	var details = {
		fname : req.body.firstName,
		lname : req.body.lastName,
		email : req.body.email,
		password : req.body.password,
		phone : req.body.phone
	};
	var detailsS = JSON.stringify(details);
	var detailsP = JSON.parse(detailsS);
	var points=0;
	var checkEmailExistsQuery = "SELECT cust_email FROM customer WHERE cust_email='"
			+ detailsP.email+"'";
	console.log("Check if email already exists query: "+checkEmailExistsQuery);
	var hashedPass=passwordHash.generate(detailsP.password);
	console.log("hashed password: "+hashedPass);
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				console.log("EMAIL: "+detailsP.email+"ALREADY TAKEN");
				checkTHflag = false;
				title="Email/thandle already taken";
				res.render('customerSignup', { errmsg: 'This email already taken', emailAlreadyExists: 1});
			} else {
				console.log("EMAIL: "+detailsP.email+"NOT TAKEN");
				var insertDetailsQuery = "INSERT INTO customer (cust_fname, cust_lname, cust_email, cust_phn, cust_pass) VALUES('" + detailsP.fname
				+ "', '" + detailsP.lname + "', '" + detailsP.email
				+ "', '" + detailsP.phone + "', '" + hashedPass + "')";
				console.log("Insert Details into DB query: "+insertDetailsQuery);
				
				var getCustomerId="select cust_id from customer where cust_email='"+detailsP.email+"'";
				mysql.fetchData(function(err, results) {
					if (err) {
						throw err;
					} else {
						
						mysql.fetchData(function(err, results) {
							if (err) {
								throw err;
							} else {
								var jsonString1= JSON.stringify(results);
								var passParsed= JSON.parse(jsonString1);
								customerID=passParsed[0].cust_id;
								console.log("The customer ID that is autogenerated by the system is : "+passParsed[0].cust_id);
								var getPointsQuery="insert into points(points, id) values('"+points+"', '"+passParsed[0].cust_id+"')";
								mysql.fetchData(function(err, results) {
									if (err) {
										throw err;
									} else {
										console.log("A row in points table for this customer is successfully created!");
										res.redirect('/redirectToHomePage');
									}
								}, getPointsQuery);
							}
						}, getCustomerId);
						
					}
				}, insertDetailsQuery);
			
			}
		}
	}, checkEmailExistsQuery);
};