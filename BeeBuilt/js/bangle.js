// Code to upload to Bangle.js
var BANGLE_CODE = `
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
`;

// When we click the connect button...
var connection;
document.getElementById("btnConnect").addEventListener("click", function () {
  // disconnect if connected already
  if (connection) {
    connection.close();
    connection = undefined;
  }
  // Connect
  Puck.connect(function (c) {
    if (!c) {
      alert("Couldn't connect!");
      return;
    }
    connection = c;
    // Handle the data we get back, and call 'onLine'
    // whenever we get a line
    var buf = "";
    connection.on("data", function (d) {
      buf += d;
      var l = buf.split("\n");
      buf = l.pop();
      l.forEach(onLine);
    });
    // First, reset the Bangle
    connection.write("reset();\n", function () {
      // Wait for it to reset itself
      setTimeout(function () {
        // Now upload our code to it
        connection.write("\x03\x10if(1){" + BANGLE_CODE + "}\n", function () {
          console.log("Ready...");
        });
      }, 1500);
    });
  });
});

// When we get a line of data, check it and if it's
// from the accelerometer, update it
function onLine(line) {
  console.log("RECEIVED:" + line);
  

  var trimmedLine = line.trim();

  if (trimmedLine === "restart") {
    console.log("Restart command received");
    gameInstance.SendMessage(
      "LogicManager", // Selects GameObject
      "restartGame",  // Calls function on game object
    );
    return;
  }

  var accel;
  var d = line.split(",");
  if (d.length == 4 && d[0] == "A") {
    // we have an accelerometer reading
    accel = {
      x: 0,
      y: 0,
      z: 0,
    };
    accel = {
      x: parseInt(d[1]),
      y: parseInt(d[2]),
      z: parseInt(d[3]),
    };
  }

  if (accel) {
    gameInstance.SendMessage(
      "MinecraftBee", // Selects GameObject
      "MoveBee",  // Calls function on game object
      JSON.stringify({ x: -accel.y, y: accel.x, z: accel.z })
    );
  }
}

// Set the position of each bar
function setBarPos(id, d) {
  var s = document.getElementById(id).style;
  if (d > 150) d = 150;
  if (d < -150) d = -150;
  if (d >= 0) {
    s.left = "150px";
    s.width = d + "px";
  } else {
    // less than 0
    s.left = 150 + d + "px";
    s.width = -d + "px";
  }
}

document.getElementById("btnIncrement").addEventListener("click", function () {
  if (!connection) {
    alert("Not connected to a Bangle.js!");
    return;
  }

  // Call the function on the Bangle.js
  connection.write("incrementCounter();\n", function () {
    console.log("Counter incremented on Bangle.js");
  });
});

function incrementCounterInWebApp() {
  // Trigger the function to increment the counter on Bangle.js
  if (connection) {
    connection.write("incrementCounter();\n");
  }
}

function showEndScreenInWebApp() {
  // Trigger the function to increment the counter on Bangle.js
  if (connection) {
    connection.write("showEndScreen();\n");
  }
}
