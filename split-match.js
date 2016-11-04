var Transform  = require('stream').Transform;
var program = require('commander');
var util = require('util');
var fs = require('fs');
var inputStream = fs.createReadStream('input-sensor.txt');


function PatternMatch(patterns) {
    Transform.call(this, { objectMode: true });
    this.pattern = patterns;
}

//PatternMatch will inherit methods from Transform; pre-ES6 stype constructors 
util.inherits(PatternMatch, Transform);

//get command line arguments
program.option('-p, --pattern <pattern>', 'enter patterns to split like:  . or ,').parse(process.argv);

var patternStream = inputStream.pipe(new PatternMatch(program.pattern)); 
//readable event emitted when data available to be read on patternStream
patternStream.on('readable', function() { 
	 var line; 
	 while((line = this.read()) !== null){   
	     console.log(line.toString()); 
	     } 
	 }); 

PatternMatch.prototype._transform = function(chunk, enc, callback) { 
    //need to convert chunk into string in order to manipulate it
    var data = chunk.toString(); 
    //generate input header to be pushed to 
    this.push('-------------------------------INPUT------------------------------'); 
    this.push(data); 
    //split string according to this.pattern, returns an array of substrings
    var result = data.split(this.pattern);
    //get rid of last part of input for pattern ,
    result.splice(result.length-1, 1);

    this.push("----------------------------------OUTPUT---------------------------------"); 
        for(var i = 0; i < result.length; i++){
	if(i == 0){
	    this.push("[ " + "'" + result[i] + "'" + ",");
	    }
	else if(i != result.length - 1){
	    this.push("'" + result[i].slice(1) + "'" + ",");
	    }
	else{
	    this.push("'" + result[i].slice(1) + "'" + " ]");
	    }
	}
    //callback to get next chunk
    callback();  
}

//not always necessary
PatternMatch.prototype._flush = function(callback) {
    callback();
}

