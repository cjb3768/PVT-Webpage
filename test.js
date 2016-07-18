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
    
    function calcTestTimeDelay(minTime,maxTime){
        return Math.floor(Math.random() * maxTime) + minTime;
    }
    
    function calcInterval(start, end){
        return end - start;
    }
    
    function storeInterval(start, end){
        timeGaps.push(calcInterval(start,end));
    }
    
    this.runTest = function(timeLimit, pageID, buttonID){
        // run test for time limit (in ms)
        
        //clear existing data points
        timeGaps.length = 0;
        
        // determine how long loop should run
        var endTime = Date.now() + timeLimit;
        
        //begin process
        var i = 0;
        var timeDelay = 0;
        var rightNow = Date.now();
        
        while (rightNow < endTime){
            //determine timeDelay for for next test
            timeDelay = calcTestTimeDelay(1000, 5000); //defaulting to between 1 and 5 seconds; we'll fix it later
            
            //set background to waiting background, change text
            //ADD CODE HERE
            $(pageID).css('backgroundColor','#880000');
            $(buttonID).html("Please wait");
            
            //wait timeDelay
            while (Date.now() < (rightNow + timeDelay)){
                //do nothing here
            }
            
            //change background, wait for mouse input
            //ADD CODE HERE
            $(pageID).css('backgroundColor','#00ff00');
            $(buttonID).html("CLICK NOW!");
            
            //mouse input received (through an asynchronously updated boolean?), record timegap
            storeInterval(rightNow + timeDelay, Date.now());
            
            //update rightNow
            rightNow = Date.now();
        }
        alert("Testing complete! That test collected " + timeGaps.length + " timegaps");
        alert(toString(timeGaps));
    }
}