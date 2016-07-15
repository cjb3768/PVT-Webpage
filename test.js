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
    
}