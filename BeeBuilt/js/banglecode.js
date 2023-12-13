Bangle.setLCDPower(1);

var counter = 0;
var currentState = "playing";

Bangle.on('accel',function(a) {
  var d = [
    "A",
    a.x*100,
    a.y*100,
    a.z*100
    ];
  Bluetooth.println(d.join(","));
});

function changeState(newState) {
    clearWatch(); // This removes all watches.
  
    currentState = newState;
    console.log("State: "+currentState);
    
      if (currentState === "playing") {
          //setWatch(startTimer, BTN1, { repeat: true, edge: "rising" });
      } else if (currentState === "endscreen") {
          setWatch(restartGame, BTN1, { repeat: true, edge: "rising" });
      }
}

function showMenu(){
    reset();
    changeState("playing");
    g.clear();
    g.setColor(0.3, 0.3, 1);
    drawLeftAlignedString("BeeActive", 30);
    g.setColor(1, 1, 1);
    drawLeftAlignedString("Yay this is fun", 120);
    g.setColor(0.3, 0.3, 0.3);
    drawLeftAlignedString("Soo good, bzzz", 210);
    g.setColor(1, 1, 1);
    g.flip();
}

function showEndScreen(){
    Bangle.buzz();
    changeState("endscreen");
    g.clear();
    g.setColor(0.3, 0.3, 1);
    drawLeftAlignedString("Try again ->", 30);
    g.setColor(1, 1, 1);
    drawCenteredString(counter, 120);
    g.setColor(0.3, 0.3, 0.3);
    drawLeftAlignedString("Does nothing ->", 210);
    g.setColor(1, 1, 1);
    g.flip();
}


function restartGame(){
    Bluetooth.println("restart");
    // TODO: Restart unity scene
}


// Bangle.setHRMPower(1);

// function showHeartRateOnScreen(hrm) {
//   var displayString = "Heart Rate: " + hrm.bpm + " BPM";

//   E.showMenu({
//     '': { 'title': displayString }
//   });

//   var bluetoothData = ["H", hrm.bpm, hrm.confidence];
//   Bluetooth.println(bluetoothData.join(","));

//   if (hrm.bpm > 80) {
//     Bangle.buzz();
//   }
// }

// Bangle.on('HRM', showHeartRateOnScreen);

function incrementCounter() {
    if (currentState = "playing") {
        counter = (typeof counter !== 'undefined' ? counter : 0) + 1;
        // Code to update the display on the Bangle.js with the new counter value
        g.clear();
        g.setFont("6x8", 2);
        g.drawString("Counter: " + counter, 20, 20);
        g.flip(); // For Bangle.js 1, for Bangle.js 2, this is not needed
    }
}


function drawCenteredString(str, y) {
    g.setFont("Vector", 20);  //font size
    g.setFontAlign(0,0);
    var screenWidth = g.getWidth();
    var x = (screenWidth/2);
  
    g.drawString(str, x, y);
}

function drawLeftAlignedString(str, y) {
    g.setFont("Vector", 20);  //font size
    g.setFontAlign(240,0);
    var screenWidth = g.getWidth();
    var x = g.getWidth();
  
    g.drawString(str, x, y);
}


//showMenu();