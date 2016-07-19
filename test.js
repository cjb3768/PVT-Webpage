/* This document consists of the functions required to operate and run the Psychomotor Vigilance Test. Key functionality required consists of:
    Beginning an examination (DONE)
    Capturing user response time (TODO - Accept mouse input as interrupt)
    Scoring the user's response time
    Writing results to a file
*/

var testActive = false; //whether test is running
var awaitingUser = false; //whether test is waiting on user to click
var startTime, finishTime; 
var testDuration = 30000; //max duration of test in ms
var waitDuration = 0; //timestamp for end of waiting period between tests
var timeGaps = []; //user delay in clicking
var startTimes = [];
var endTimes = [];
var avgGap=0; //average user delayin clicking
var rightNow = Date.now();
var timeDelay = 0; //current 
var minDelay = 1000; //minimum delay between tests
var maxDelay = 5000; //maximum delay between tests
    
function calcTestTimeDelay(minTime,maxTime){
    return Math.floor(Math.random() * maxTime) + minTime;
}

function storeTimestamps(start,end){
    startTimes.push(start);
    endTimes.push(end);
}

function calcInterval(start, end){
    return end - start;
}
    
function storeInterval(start, end){
    timeGaps.push(calcInterval(start,end));
}

function getFinishTime(timeLimit){
    return Date.now() + timeLimit;
}
    
function mouseDown(evt){
    if (testActive === false){
        //start test
        //setWaitIndicators();
        testActive = true;
        
        for (var i = 0; i < 5; i++){
            
        }
        //$('#result').html("Beginning test, please wait");
        startPVT();
    }
    else{
        //test running
        //testActive = false;
        //$('#result').html("Test is running");
        if (!awaitingUser){
            //alert user of false start (TO-DO: find out if these need to be isolated)
            $('#result').html("You've clicked too soon!");
        }
        else{
            //store intervbal between delay and mouse down
            var capturedClick = Date.now();
            storeTimestamps(waitDuration, capturedClick);
            storeInterval(waitDuration, capturedClick);
            //reset indicators and flag
            setWaitIndicators();
            awaitingUser = false;
            setWaitIndicators();
            //set up next delay
            waitDelay();
        }
    }
}

function startPVT(){
    //clear existing data points
    timeGaps.length = 0;
    startTimes.length = 0;
    endTimes.length = 0;
    
    //get startTime
    startTime = Date.now();
    
    //get finishTime
    finishTime = getFinishTime(testDuration);
    
    //call function to wait for first duration
    waitDelay();
}

function keepTesting(){
    rightNow = Date.now();
    //see if we already passed the finishTime
    if (rightNow < finishTime){
        //calculate delay and see if we can keep testing
        timeDelay = calcTestTimeDelay(minDelay,maxDelay);
        waitDuration = rightNow + timeDelay;
        if ((waitDuration) < finishTime){
            return true;
        }
        //not enough time for testing, end testing
        return false;
    }
    else{
        //passed finishTime, end testing
        return false;
    }
}

function waitDelay(){

    //see if test should be run
    if (keepTesting()){
        while (Date.now() < waitDuration){
            //do nothing
        }
        setClickIndicators();
        awaitingUser = true;
    }
    else{
        //handle ending
        endPVT();
        
    }
}

function endPVT(){
    //end testing
    testActive = false;
    setCompleteIndicators();
    alert("Testing complete! That test collected " + timeGaps.length + " timegaps");
    var recordedTime = "";
    for (var j = 0; j < timeGaps.length;j++){
        recordedTime += "" + timeGaps[j] + "ms, ";
    }
    alert(recordedTime);
}

function setWaitIndicators(){
    $("#page").css('backgroundColor','#aa0000').show();
    $('#result').html("Click registered! Please wait.").show();
    //$("#start").html("Please wait").show();
    
}

function setClickIndicators(){
    $("#page").css('backgroundColor','#00ff00');
    $("#result").html("CLICK NOW!");
}

function setCompleteIndicators(){
    $("#page").css('backgroundColor','#00eeff');
    $("#result").html("Click to start new test");
}
/**
    function runTest(timeLimit, pageID, buttonID){
        // run test for time limit (in ms)
        
        //clear existing data points
        timeGaps.length = 0;
        
        // determine how long loop should run
        var endTime = getEndTime(timeLimit);
        
        //begin process
        var i = 0;
        timeDelay = 0;
        rightNow = Date.now();
        
        while (rightNow < endTime){
            //determine timeDelay for for next test
            timeDelay = calcTestTimeDelay(1000, 5000); //defaulting to between 1 and 5 seconds; we'll fix it later
            
            //set background to waiting background, change text
            $(pageID).css('backgroundColor','#880000');
            $(buttonID).html("Please wait");
            
            //wait timeDelay
            while (Date.now() < (rightNow + timeDelay)){
                //do nothing here
            }
            
            //change background and text
            $(pageID).css('backgroundColor','#00ff00');
            $(buttonID).html("CLICK NOW!");
            
            //wait for mouse input
            //TODO - handle asynch interrupt here
            //use while loop to wait
            
            //mouse input received (through an asynchronously updated boolean?), record timegap
            storeInterval(rightNow + timeDelay, Date.now());
            
            //update rightNow
            rightNow = Date.now();
        }
        alert("Testing complete! That test collected " + timeGaps.length + " timegaps");
        var recordedTime = "";
        for (var j = 0; j < timeGaps.length;j++){
            recordedTime += "" + timeGaps[j] + "ms, ";
        }
        alert(recordedTime);
    }
*/

function init(){
    document.getElementById("page").onmousedown = mouseDown;
    setCompleteIndicators();
}
