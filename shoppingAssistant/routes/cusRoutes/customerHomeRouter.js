
exports.returnCustomerHomepage = function(req, res){
  res.render('Customer/customerHomepage');
};

//Redirect to homepage

exports.redirectToHomePage = function(req, res){
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('Customer/customerHomepage', {username:req.session.username});
	}
	else
	{
		res.redirect('/customerLogin');
	}
	
};