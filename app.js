
/**
 * Module dependencies.
 */

var express     = require('express');
var fs          = require('fs');
var http        = require('http');
var dburl       = "test";
var collections = ["people"]
var db          = require("mongojs").connect(dburl, collections);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view options', {layout:false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  app.register('.html', {
  	compile:function(str, options){
  		return function(local){
  			return str;
  		};
  	}
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index.html');
});


app.listen(4000, '0.0.0.0', function() {
  console.log("Application server listening on port %d in %s mode", app.address().port, app.settings.env);
});
// Private Methods


// Mongo Methods

app.post('/addData', function(req, res){
      dbInsert(req,res);
});

app.post('/showData', function(req, res){
      dbSelect(req,res);
});




   function dbInsert(req,res){
        console.log("inside post add method");
        var contactName = req.param('contactName', 'no_name');  // second parameter is default
        var email       = req.param('email', 'no_mail');  // second parameter is default
        db.people.insert({ name : contactName, email : email}, function(err, people) {
		if(err || !people) 
			console.log("Insertion Failed");
		else people.forEach(function(inserted){
			console.log(inserted);
			res.end('Data Inserted');
		});
	});
    }
   function dbSelect(req,res){
    console.log("inside post show method");
        db.people.find({},function(err, people) {
		cursor = people;
		console.log(cursor);
		if(err || !people) 
		        console.log("Selection Failed");
		else people.forEach(function(selected){
			console.log(selected);
			res.end(JSON.stringify(cursor));
		});
	});
    }		
