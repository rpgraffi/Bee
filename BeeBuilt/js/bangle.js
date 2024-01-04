// Code to upload to Bangle.js
var BANGLE_CODE = `
var counter = 0;
var currentState = "playing";

Bangle.on("accel", function (a) {
  var d = ["A", a.x * 100, a.y * 100, a.z * 100];
  Bluetooth.println(d.join(","));
});


Bangle.setHRMPower(1);

function showHeartRateOnScreen(hrm) {
  var displayString = "Heart Rate: " + hrm.bpm + " BPM";


  var bluetoothData = ["H", hrm.bpm, hrm.confidence];
  Bluetooth.println(bluetoothData.join(","));

  if (hrm.bpm > 80) {
    Bangle.buzz();
  }
}

Bangle.on('HRM', showHeartRateOnScreen);



function changeState(newState) {
  clearWatch(); // This removes all watches.

  currentState = newState;
  console.log("State: " + currentState);

  if (currentState === "playing") {
    setWatch(pauseGame, BTN3, { repeat: true, edge: "rising" });
  } else if (currentState === "paused") {
    setWatch(resumeGame, BTN3, { repeat: true, edge: "rising" });
  } else if (currentState === "endscreen") {
    setWatch(restartGame, BTN1, { repeat: true, edge: "rising" });
  }
}

function showMenu() {
  g.clear();
  g.setColor(0.3, 0.3, 1);
  drawLeftAlignedString("BeeActive", 30);
  g.setColor(1, 1, 1);
  drawCounter(counter);
  g.setColor(.5, .5, 1);
  drawLeftAlignedString("Resume ->", 210);
  g.setColor(1, 1, 1);
  g.flip();
}

function showEndScreen() {
  Bangle.buzz();
  changeState("endscreen");
  g.clear();
  g.setColor(0.3, 0.3, 1);
  drawLeftAlignedString("Try again ->", 30);
  g.setColor(1, 1, 1);
  drawCounter(counter);
  g.setColor(1, 1, 1);
  g.flip();
  Bangle.setLCDPower(1);
}

function restartGame() {
  changeState("playing");
  counter = 0;
  g.clear();
  drawCounter(counter);
  Bluetooth.println("restart");
}

function pauseGame() {
  changeState("paused");
  Bluetooth.println("pause");
  showMenu();
}

function resumeGame() {
  changeState("playing");
  Bluetooth.println("resume");
}

function incrementCounter() {
  if ((currentState = "playing")) {
    counter = (typeof counter !== "undefined" ? counter : 0) + 1;
    g.clear();
    drawCounter(counter);
  }
}

function drawCounter(score) {
  g.setFontAlign(0, 0); // center font
  g.setFont("Vector", 80); // vector font, 80px
  // draw the current counter value
  g.drawString(score, 120, 120);

  // optional - this keeps the watch LCD lit up
  Bangle.setLCDPower(1);
}

function drawCenteredString(str, y) {
  g.setFont("Vector", 20); //font size
  g.setFontAlign(0, 0);
  var screenWidth = g.getWidth();
  var x = screenWidth / 2;

  g.drawString(str, x, y);
}

function drawLeftAlignedString(str, y) {
  g.setFont("Vector", 20); //font size
  g.setFontAlign(240, 0);
  var screenWidth = g.getWidth();
  var x = g.getWidth();

  g.drawString(str, x, y);
}
showMenu()

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
  
  if (trimmedLine === "pause") {
    console.log("Pause command recieved");
    gameInstance.SendMessage(
      "LogicManager", // Selects GameObject
      "PauseGame",  // Calls function on game object
    );
    return;
    
  }
  if (trimmedLine === "resume") {
    console.log("Pause command recieved");
    gameInstance.SendMessage(
      "LogicManager", // Selects GameObject
      "ResumeGame",  // Calls function on game object
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
