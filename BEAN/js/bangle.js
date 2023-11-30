// Code to upload to Bangle.js
var BANGLE_CODE = `
Bangle.on('accel',function(a) {
  var d = [
    "A",
    Math.round(a.x*100),
    Math.round(a.y*100),
    Math.round(a.z*100)
    ];
  Bluetooth.println(d.join(","));
})
`;

// When we click the connect button...
var connection;
document.getElementById("btnConnect").addEventListener("click", function() {
  // disconnect if connected already
  if (connection) {
    connection.close();
    connection = undefined;
  }
  // Connect
  Puck.connect(function(c) {
    if (!c) {
      alert("Couldn't connect!");
      return;
    }
    connection = c;
    // Handle the data we get back, and call 'onLine'
    // whenever we get a line
    var buf = "";
    connection.on("data", function(d) {
      buf += d;
      var l = buf.split("\n");
      buf = l.pop();
      l.forEach(onLine);
    });
    // First, reset the Bangle
    connection.write("reset();\n", function() {
      // Wait for it to reset itself
      setTimeout(function() {
        // Now upload our code to it
        connection.write("\x03\x10if(1){"+BANGLE_CODE+"}\n",
          function() { console.log("Ready..."); });
      }, 1500);
    });
  });
});

// When we get a line of data, check it and if it's
// from the accelerometer, update it
function onLine(line) {
  console.log("RECEIVED:"+line);

  var d = line.split(",");
  if (d.length==4 && d[0]=="A") {
      // we have an accelerometer reading
      var accel = {
          x : 0,
          y : 0,
          z : 0,
        };    
      accel = {
          x : parseInt(d[1]),
          y : parseInt(d[2]),
          z : parseInt(d[3]),
        };    
      }
      console.log(accel.x +" "+ accel.y + " " + accel.z);
      gameInstance.SendMessage('Bean', 'MoveBean', JSON.stringify({ x: accel.x, y: accel.y, z: accel.z }));

}
// Set the position of each bar
function setBarPos(id,d) {
  var s = document.getElementById(id).style;
  if (d>150) d=150;
  if (d<-150) d=-150;
  if (d>=0) {
    s.left="150px";
    s.width=d+"px";
  } else { // less than 0
    s.left=(150+d)+"px";
    s.width=(-d)+"px";
  }
}
