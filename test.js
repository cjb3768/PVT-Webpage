/* This document consists of the functions required to operate and run the Psychomotor Vigilance Test. Key functionality required consists of:
    Beginning an examination
    Capturing user response time
    Scoring the user's response time
    Writing results to a file
*/

function hello() {
    //alert("clicked");
}

var pvt = function() {
    
    var backgroundSwitch = 0;
    var startTime = 0;
    var endTime = 0;
    var timeGaps = [];
    
    this.changeButtonText = function() {
        if (backgroundSwitch===0){
            return "Click to change background";
        }
        else if (backgroundSwitch===1){
            return "Click to revert changes";
        }
        return "Something went wrong";
    }
    
    this.getBackgroundColor = function() {
        if (backgroundSwitch===0){
            backgroundSwitch = 1;
            return '#880000';
        }
        else if (backgroundSwitch===1){
            backgroundSwitch = 0;
            return '#00ff00';
        }
        else{
            return '#000000';
        }
    }
    
    this.alterBackground = function(domElement){
        $(domElement).style.backgroundColor = this.getBackgroundColor();
        $(domElement).html() = changeButtonText();
    }
    
    this.calcTestTimeDelay = function(minTime,maxTime){
        return Math.floor(Math.random() * maxTime) + minTime;
    }
    
    function calcInterval(start, end){
        return end - start;
    }
    
    function storeInterval(start, end){
        timeGaps.push(this.calcInterval(start,end));
    }
    
    this.runTest = function(timeLimit){
        // run test for time limit (in ms)
        
        // calculate starting time
        var startTime = Date.now();
        
        // determine how long loop should run
        var endTime = startTime + timeLimit;
        
        //begin process
        var i = 0;
        while (Date.now() < endTime){
            //do things
            i += 1;
        }
        alert("Testing complete! That took " + i + " cycles");
        
    }
}