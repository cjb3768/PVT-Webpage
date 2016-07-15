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
    
    function returnDate() {
        return Date.now();
    }
    
    function getBackgroundColor() {
        if (backgroundSwitch===0){
            backgroundSwitch = 1;
            return '#ff0000';
        }
        else if (backgroundSwitch===1){
            backgroundSwitch = 0;
            return '#00ff00';
        }
        else{
            return '#000000';
        }
    }
    
}