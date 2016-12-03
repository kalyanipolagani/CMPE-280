var ejs= require('ejs');
var mysql = require('mysql');

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	var pool = mysql.createPool({
	    connectionLimit : 100,
		host     : 'mydbinstance.cum1koe02itt.us-east-1.rds.amazonaws.com',
	    user     : 'cmpe280',
	    password : 'abcd1234',
	    database : 'cmpe280',
	    port	 : 3306
	});
	return pool;
}

function escape(token){
	return  mysql.escape(token);
}
exports.escape=escape;

function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connectionPool=getConnection();
	connectionPool.getConnection(function(err,connectionPool){
        if (err) {
          connectionPool.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connectionPool.threadId);
        
            connectionPool.query(sqlQuery, function(err, rows, fields) {
            	connectionPool.release();
            	if(err){
        			console.log("ERROR: " + err.message);
        		}
        		else 
        		{	// return err or result
        			console.log("DB Results:"+rows);
        			callback(err, rows);
        			
        		}
        });
            connectionPool.on('error', function(err) {      
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;     
                });    
	}); 
	console.log("\nConnection closed..");
	//connection.end();
}	

exports.fetchData=fetchData;