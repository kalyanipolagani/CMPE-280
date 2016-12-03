
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , session = require('client-sessions');
var fileUpload = require('express-fileupload');
var multer=require('multer');

//Custom paths
var cusPointer1=require('./routes/cusRoutes/customerHomeRouter');
var cusPointer2=require('./routes/cusRoutes/searchRestaurents');
var cusPointer3=require('./routes/cusRoutes/customerLogin');
var cusPointer4=require('./routes/cusRoutes/customerSignup');
var cusPointer5=require('./routes/cusRoutes/addBill');
var cusPointer6=require('./routes/cusRoutes/redeemPoints');
var cusPointer7=require('./routes/cusRoutes/about');
var cusPointer8=require('./routes/cusRoutes/contact');
var app = express();
var busboy = require('connect-busboy');

//Session
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'shopping_secret_key',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(fileUpload());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy()); 
var upload = multer({ dest: './uploads/' });
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//Starting page
app.get('/',routes.index);

app.get('/customerSignup', cusPointer4.getCustSignUpPage);
app.get('/users', user.list);
//Customer Homepage
app.post('/search',cusPointer2.searchRestaurents);
app.get('/redirectToHomePage', cusPointer1.redirectToHomePage);
//Customer Login
app.get('/logout', cusPointer3.logout);
app.get('/customerLogin',cusPointer3.getCustLoginPage);
app.post('/checkCustLoginDetails',cusPointer3.checkCustLoginDetails);
//Customer Signup
app.get('/customerSignup',cusPointer4.getCustSignUpPage);
app.post('/postSignUpDetails', upload.single('file'),cusPointer4.postSignUpDetails);

//Search Results and add bill
app.get('/addBill', cusPointer5.addBill);
app.post('/postBillDetails',cusPointer5.postBillDetails); 
		/*cusPointer5.postBillDetails);*/


//redeem points
app.get('/myPoints',cusPointer6.getMyPoints);
/*app.get('/redeemPoints',cusPointer6.redeemMyPoints);*/

//about and contact
app.get('/about', cusPointer7.about);
app.get('/contact',cusPointer8.contact);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
