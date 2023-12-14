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
    drawCounter(counter);
    g.setColor(0.3, 0.3, 0.3);
    drawLeftAlignedString("Does nothing ->", 210);
    g.setColor(1, 1, 1);
    g.flip();
    Bangle.setLCDPower(1);
}



function restartGame(){
    changeState("playing")
    counter = 0;
    g.clear();
    drawCounter(counter)
    Bluetooth.println("restart");
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
        g.clear();
        drawCounter(counter);
    }
}

function drawCounter(score){
    g.setFontAlign(0,0); // center font
    g.setFont("Vector",80); // vector font, 80px  
    // draw the current counter value
    g.drawString(score,120,120);
    
    // optional - this keeps the watch LCD lit up
    Bangle.setLCDPower(1);

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