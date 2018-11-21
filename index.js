var express = require('express');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser')

console.log(process.env.S3_KEY);
console.log(process.env.S3_SECRET);
console.log(process.env.S3_REGION);

AWS.config.update({region: process.env.S3_REGION, profile: "fitz"});
var s3 = new AWS.S3();


var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({ extended: false }))

var s3DataContents = [];

function s3Print() {
	if (false) {
		// --al: Print all objects
		console.log(JSON.stringify(s3DataContents, null, "    "));
	} else {
		// --b: Print key only, otherwise also print index
		var i;
		for (i = 0; i < s3DataContents.length; i++) {
			//var head = !program.b ? (i+1) + ": " : "";
			console.log(s3DataContents[i].Prefix);
		}
	}
}
function s3JsonDirs(res) {
    var i;
    var json = [];
    for (i = 0; i < s3DataContents.length; i++) {
     //var head = !program.b ? (i+1) + ": " : "";
     json.push(s3DataContents[i].Prefix);
    }
    res.send(json);
    
}

function s3ListObjects(params,res, cb) {
    console.log("1");
	s3.listObjects(params, function(err, data) {
		if (err) {
			console.log("listS3Objects Error:", err);
		} else {
            console.log("2");
			var contents = data.Contents;
			var dirs = data.CommonPrefixes;
            console.log(dirs[0].Prefix);
			s3DataContents = s3DataContents.concat(dirs);
			if (data.IsTruncated) {
				// Set Marker to last returned key
				params.Marker = dirs[dirs.length-1].Key;
				s3ListObjects(params, res, cb);
			} else {
				cb(res);
			}
		}
	});
}


app.get("/", function(req, res){
        res.send("<h1>test</h1>");
});
app.get("/search", function(req, res){
        res.send("<h1>search</h1>");
});
app.get("/query", function(req, res){
    //res.send("<h1>query</h1>");
    var params = {
        Bucket: process.env.S3_BUCKET,
        Prefix: req.query.prefix,
        Delimiter: '/',
    };
    console.log("params: %o", params);
    s3ListObjects(params, res, s3JsonDirs);
});
app.get("/annotations", function(req, res){
        res.send("<h1>annotations</h1>");
});
app.get("/tag-keys ", function(req, res){
        res.send("<h1>tag-keys</h1>");
});
app.get("/tag-values ", function(req, res){
        res.send("<h1>tag-vaules</h1>");
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


