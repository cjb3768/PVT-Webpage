/* This document consists of the functions required to operate and run the Psychomotor Vigilance Test. Key functionality required consists of:
    Beginning an examination (DONE)
    Capturing user response time (DONE)
    Scoring the user's response time (Currently collecting an average, should we do more?)
    Convert results to desired print format (DONE, UNLESS WE NEED TO ADD MORE DATA)
    Create unique filename (DONE)
    Writing results to a file (DONE)
    Alter filesave location (Currently dumping directly to downloads)
    
    This document was based on the implementation found at http://www.sleepdisordersflorida.com/pvt1.html
*/

var testActive = false; //whether test is running
var awaitingUser = false; //whether test is waiting on user to click
var startTime, finishTime; 
var startDate;
var testDuration = 10000; //30000; //120000; //max duration of test in ms
var waitDuration = 0; //timestamp for end of waiting period between tests
var timeGaps = []; //user delay in clicking
var startTimes = [];
var endTimes = [];
var avgGap=0; //average user delay in clicking
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
        setWaitIndicators();
        testActive = true;
        startPVT();
    }
    else{
        //test running
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
            
            //set up next delay
            nextDelay();  
        }
    }
}

function startPVT(){
    //clear existing data points
    timeGaps.length = 0;
    startTimes.length = 0;
    endTimes.length = 0;
    
    //get startTime
    startDate = new Date();
    startTime = Date.now();
    
    //get finishTime
    finishTime = getFinishTime(testDuration);
    
    //call function to wait for first duration
    nextDelay();
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

function endPVT(){
    //end testing
    testActive = false;
    setCompleteIndicators();
    alert("Testing complete! That test collected " + timeGaps.length + " timegaps");
    var recordedTime = "";
    var totalGapTime = 0;
    for (var j = 0; j < timeGaps.length; j++){
        recordedTime += "" + timeGaps[j] + "ms";
        totalGapTime += timeGaps[j];
        if(j != timeGaps.length -1){
            recordedTime += ", ";
        }
    }
    alert(recordedTime);
    //get average response time
    avgGap = totalGapTime/timeGaps.length;
    alert("Average response time = " + avgGap + "ms");
    //print results to file
    var printString = formatPrintString(timeGaps,avgGap);
    var fileName = generateFileName();
    download(printString,fileName,"text/csv");
}

function setWaitIndicators(){
    $("#page").css('backgroundColor','#aa0000');
    $('#result').html("Click registered! Please wait.");
}

function setClickIndicators(){
    $("#page").css('backgroundColor','#00ff00');
    $("#result").html("CLICK NOW!");
}

function setCompleteIndicators(){
    $("#page").css('backgroundColor','#00eeff');
    $("#result").html("Click to start new test");
}

/* trigger PVT click prompt */
function readyForUser(n){

    return new Promise(resolve =>{
        if (keepTesting()){
            setTimeout(()=>{
                setClickIndicators();
                awaitingUser = true;
                resolve(n);
            },timeDelay);
        }
        else{
            endPVT();
            resolve(n);   
        }
    });
}

async function nextDelay(){
    readyForUser(0);
}

function init(){
    document.getElementById("page").onmousedown = mouseDown;
    setCompleteIndicators();
}

function formatPrintString(gaps,avg){
    
    var printString = "Gap Number, Gap Length, Average Gap Length, Offset From Average";
    
    //-----------------------------------------
    //add any additional columns heads here
    printString += "";
    //-----------------------------------------
    
    printString += "\n";
    
    for (var j = 0; j < gaps.length; j++){
        //add gap number
        printString += "" + j;
        //add gap time
        printString += "," + gaps[j];
        //add average time
        printString += "," + avg;
        //calculate offset from average
        printString += "," + (gaps[j] - avg);
        
        //---------------------------------------
        //    add any other data to print here
        printString += "";
        //---------------------------------------
        
        //end line with newline character
        printString += "\n";
        
    }
    return printString;
}

function generateFileName(){
    //filename of format "Day-Month-Year_Hour:Minute:Second:Millisecond-PVTResults.csv"
    var fileName = "PVT Results, ";
    //day-month-year
    fileName += "" + startDate.getDate() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getFullYear() + ", ";
    //fileName += "" + startTime.toLocaleDateString();
    //hour-min-second
    //fileName += "" + startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds() + ":" + startDate.getMilliseconds();
    fileName += "" + startDate.toLocaleTimeString();
    //finish filename
    fileName += ".csv";
    //return fileName
    return fileName;
}

/**
    File printing code taken from StackOverflow
    https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
*/

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

