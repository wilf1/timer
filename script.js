
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');


function getWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

function getHeight() {
  if (self.innerHeight) {
    return self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}


var width = getWidth();
var height = 600;
console.log(width);
canvas.style.width = width + "px";
canvas.style.height = height + "px";

// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.width = Math.floor(width * scale);
canvas.height = Math.floor(height * scale);

// Normalize coordinate system to use css pixels.
ctx.scale(scale, scale);

console.log('hello');

function formatTimeInterval(millis)
{
  var negative = false;
  if (millis < 0)
    {
      negative = true;
      millis = -1 * millis;
    }
  var minutes = Math.floor(millis / 60000);
  var seconds = Math.floor((millis % 60000)/1000);
  var negativeString = "";
  if (negative)
    {
      negativeString = "-"
    }
  if (seconds < 10)
    {
      return negativeString + minutes.toString() + ":0" + seconds.toString();
    }
  else
    {
  return negativeString + minutes.toString() + ":" + seconds.toString();
    }
}

function drawTimer(x, y, size, timeLeft, totalTime, isActive)
{
  
  var fraction = timeLeft / totalTime;
  var negative = false;
  if (timeLeft < 0)
    {
      fraction = (timeLeft % 60000)/60000;
      negative = true;
    }
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.lineWidth = 10;
  var faceColor = "#202560";
  if (negative)
    {
      faceColor= "#601520";
    }
  ctx.strokeStyle = faceColor;
  ctx.fillStyle = faceColor;
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, size, Math.PI * -0.5, Math.PI * 2 * (fraction - 0.25));
  ctx.lineWidth = 10;
  if (isActive)
    {
      var arcColor = "#BBCCFF";
      if(negative)
        {
          arcColor = "#FFBBBB";
        }
    }
  else
    {
      var arcColor = "#6688DD";
      if(negative)
        {
          arcColor = "#DD3366";
        }
    }
  ctx.strokeStyle = arcColor;
  ctx.stroke();
  ctx.fillStyle = arcColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = (size * 3 / 8).toString() + "px helvetica";
  ctx.fillText(formatTimeInterval(timeLeft), x, y);
}
drawTimer(200, 200, 100, 20, 200)

var resetTime = Date.now();

var n = 4;
var playersField = document.getElementById("players");
playersField.value = n;
var totalTime = 15 * 60 * 1000;

var timeField = document.getElementById("total-time");
timeField.value = totalTime / 60000;
var incrementField = document.getElementById("increment");
incrementField.value = 0;
var times = [];
for (var i = 0; i < n; i++)
{
  times.push(totalTime);
}

function reset()
{
 n = playersField.value;
 totalTime = timeField.value * 60000;
  times = [];
  for (var i = 0; i < n; i++)
    {
      times.push(totalTime);
    }
  setPositions();
  currentPlayer = 2 * n - 1;
  
}
var xPositions = [0,0,0,0,0,0,0];
var yPositions = [0,0,0,0,0,0,0];
function setPositions()
{
  if(n == 4)
    {
       xPositions = [width/2 - 160,width/2 + 160,width/2 + 160,width/2 - 160];
       yPositions = [150,150,450,450];
    }
  if(n == 3)
    {
       xPositions = [width/4,width/2,3 * width/4];
       yPositions = [height/2, height/2, height/2];
    }
  if(n == 3)
    {
       xPositions = [width/3, 2 * width/3];
       yPositions = [height/2, height/2];
    }
}
setPositions();


var currentPlayer = 2 * n - 1;

var resetButton = document.getElementById("reset-button");


function animate(timestamp) {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  for (var i = 0; i < n; i++)
    {
      if (currentPlayer == i)
        {
          drawTimer(xPositions[i],yPositions[i],120,times[i] - (Date.now() - resetTime), totalTime, true);
        }
      else{
      drawTimer(xPositions[i],yPositions[i],120,times[i], totalTime, false);
      }
    }
  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

function switchToPlayer(newPlayer)
{
  if (currentPlayer < n)
    {
      times[currentPlayer] -= Date.now() - resetTime;
    }
  resetTime = Date.now();
  currentPlayer = newPlayer;
}

document.addEventListener('keypress', function(event)
                         {
  console.log(event.code);
  if (event.code == "Space")
    {
      switchToPlayer((currentPlayer + 1)%n);
    }
  if (event.code == "KeyP")
    {
      switchToPlayer(currentPlayer + n);
    }
  if (event.code == "Digit1")
    {
      switchToPlayer(0);
    }
  if (event.code == "Digit2")
    {
      switchToPlayer(1);
    }
  if (event.code == "Digit3")
    {
      switchToPlayer(2);
    }
  if (event.code == "Digit4")
    {
      switchToPlayer(3);
    }
})

resetButton.addEventListener('click', function(event)
                            {
  reset();
})
