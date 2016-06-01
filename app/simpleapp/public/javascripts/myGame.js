var myGamePiece;
var waterDroplets = [];
var scoreBoard;
var livesBoard;
var mainImages = ["/images/Rubbish.png", "/images/WashHair.png", "/images/SavingShower.png", "/images/DishWasher.png", "/images/WaterCollection.png", "/images/ThawFood.png",
"/images/SwimmingPool.png", "/images/Kettle.png", "/images/WashCar.png", "/images/WaterGarden.png", "/images/WaterLeaks.png", "/images/WaterMeter.png"];
var imgNo = 0;
var highScore = 0;

//Game Starter Function
function startGame() {
    myGamePiece = new component(60, 60, "WaterBucket.png", 265, 600, "image");
    scoreBoard = new component("20px", "Arial", "black", 5, 20, "text");
    livesBoard = new component("20px", "Arial", "black", 500, 20, "text");
    //footerStart();
    myGameArea.start();
    window.addEventListener("keydown",doKeyDown,true);
    window.addEventListener("keyup",doKeyUp,true);
    myGameArea.stop();
}
//Footer Starter Function
function footerStart() {
  dateTime();
  setInterval(currentTime, 100);
}

//Starter function for Mainpage
function mainFooter() {
  footerStart();
  setInterval(mainStarter, 5000);
}

//Resets Games Variables
function resetVariables() {
  myGamePiece = new component(60, 60, "/images/WaterBucket.png", 265, 600, "image");
  waterDroplets = [];
}
//Creates the Game Canvas and inserts it into the HTML
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        var game = document.getElementById("game");
        game.insertBefore(this.canvas, game.childNodes[0]);
        this.frameNo=0;
        this.lives =1;
        this.score=0;
        this.timer=2;
        updateGameArea();
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
	  var score = document.getElementById("hidden");
	  score.value = this.score;
      clearInterval(this.interval);
    },
    restart : function() {
      clearInterval(this.interval);
      this.lives =1;
      this.score=0;
      this.timer=2;
      this.frameNo=0;
      resetVariables();
      this.interval = setInterval(updateGameArea, 20);
    }
  }
//retrieves and writes the date and time into the footer
function dateTime() {
  var x = new Date(document.lastModified);
  document.getElementById("p1").innerHTML = "Last Modified: " + readTime(x)+ " " + x.getDate() + readMonth(x) + x.getFullYear();
}
//retrieves the current time and writes to footer
function currentTime() {
  var x = new Date();
  document.getElementById("p2").innerHTML = "Current Time: " + readTime(x);
}
//turns the month number into a month word
function readMonth(x){
  var m = x.getMonth();
  if(m == 1){
    return "Jan";
  }
  if(m == 2){
    return "Feb";
  }
  if(m == 3){
    return "Mar";
  }
  if(m == 4){
    return "Apr";
  }
  if(m == 5){
    return " May ";
  }
  if(m == 6){
    return " Jun ";
  }
  if(m == 7){
    return " Jul ";
  }
  if(m == 8){
    return " Aug ";
  }
  if(m == 9){
    return " Sep ";
  }
  if(m == 10){
    return " Oct ";
  }
  if(m == 11){
    return " Nov ";
  }
  if(m == 12){
    return " Dec ";
  }
}
//parses the months into 12hr clock and pm or am then returns the string
function readTime(x) {
  var h = x.getHours();
  var m = x.getMinutes();
  var s = " AM";
  if(h > 12){
    h -= 12;
    s = " PM";
  }
  if(m < 10) {
    return h.toString() + ":" + "0" + m.toString() + s;
  }
  else {
    return h.toString() + ":" + m.toString() + s;
  }
}
//creator method for the different objects within the canvas/game
function component(width, height, color, x, y, type) {
    this.type = type;
    if(type == "image" || type == "score" || type == "death" || type == "life") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.rightspeed = 0;
    this.leftspeed = 0;
    this.upspeed = 0;
    this.downspeed = 0;
    this.update = function() {
    var ctx = myGameArea.context;
    if(type == "image" || type == "score" || type == "death" || type == "life"){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    else if(this.type == "text"){
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    else{
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    this.newPos = function() {
        this.x += this.rightspeed + this.leftspeed;
        this.y += this.upspeed + this.downspeed;
    }
    this.bucketWallCheck = function() {
      if(this.x < 0){
        this.x=0;
      }
      if(this.x > 600-this.width){
        this.x=600-this.width;
      }
      if(this.y < 0){
        this.y =0;
      }
      if(this.y > 600-this.height){
        this.y = 600-this.height;
      }
    }
    this.dropletBucketCollision = function(droplet) {
      var bucketLeft = this.x;
      var bucketRight = this.x + (this.width);
      var bucketTop = this.y;
      var bucketBot = this.y + (this.height);
      var dropletLeft = droplet.x;
      var dropletRight = droplet.x + (droplet.width);
      var dropletTop = droplet.y;
      var dropletBot = droplet.y + (droplet.height);
      var collide = true;
      if((bucketBot < dropletTop) || (bucketTop > dropletBot)){
        collide = false;
      }
      if((bucketRight < dropletLeft) || (bucketLeft > dropletRight)){
        collide = false;
      }
      return collide;
    }
}
//checks if the arrow keys or enter key have been pushed &
//sets the relevant function
function doKeyDown(e){
  if(e.keyCode == 37){
    moveleft();
  }
  if(e.keyCode == 38) {
    moveup();
  }
  if(e.keyCode == 39){
    moveright();
  }
  if(e.keyCode == 40){
    movedown();
  }
  if(e.keyCode == 13){
    myGameArea.restart();
  }
}
//checks if the arrow keys or enter keys have been released &
//sets the relevant speeds
function doKeyUp(e){
  if(e.keyCode == 37){
    myGamePiece.leftspeed = 0;
  }
  if(e.keyCode == 38) {
    myGamePiece.upspeed = 0;
  }
  if(e.keyCode == 39){
    myGamePiece.rightspeed = 0;
  }
  if(e.keyCode == 40){
    myGamePiece.downspeed = 0;
  }
}
//funtion that returns true at an interval n for frames
function everyinterval(n) {
  if((myGameArea.frameNo / n) % 1 == 0){
    return true;
  }
  return false;
}

//function that returns true at an interval n for score
function difficultyInterval(n) {
  if(myGameArea.score == 0){
    return false;
  }
  if((myGameArea.score / n) % 1 == 0){
    return true;
  }
  return false;
}
//creates a random weight between the min and max
function randomWeight(min, max) {
  var weight1, weight2, weigth3, finalWeight;
  weight1 = Math.random();
  weight2 = Math.random();
  weight3 = Math.random();
  finalWeight = Math.min(weight1, weight2, weight3)*max;
  if(finalWeight < min){
    finalWeight = min;
  }
  return finalWeight;
}
//updates the game with each peices movements &
//does checkers and parses collisions/score changes and life changes &
//creates all falling peices
function updateGameArea() {
    var x,x2,x3, finalWeight, finalweight2, finalweight3;
    for(i=0; i < waterDroplets.length; i += 1){
      if(myGamePiece.dropletBucketCollision(waterDroplets[i]) == true){
        if(waterDroplets[i].type == "life"){
          myGameArea.lives += 1;
        }
        else if(waterDroplets[i].type == "death"){
          myGameArea.lives -= 1;
        }
        else{
        myGameArea.score += waterDroplets[i].width + waterDroplets[i].downspeed;
        }
        waterDroplets.splice(i, 1);
      }
    }
    if(myGameArea.lives == 0){ + 20
      myGameArea.stop();
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if(everyinterval(200)){
      myGameArea.timer -= 0.03;
      if(myGameArea.timer < 0.5){
        myGameArea.timer = 0.5;
      }
    }
    //if loop for creating Death Droplets
    if(everyinterval(Math.round(100*myGameArea.timer*2))) {
      x = myGameArea.canvas.width*Math.random();
      x2 = myGameArea.canvas.width*Math.random();
      finalWeight = randomWeight(40,80);
      finalweight2 = randomWeight(40,80);
      waterDroplets.push(new component(finalWeight, finalWeight, "/images/WaterDropBad.png", x, -50, "death"));
      waterDroplets.push(new component(finalweight2, finalweight2, "/images/WaterDropBad.png", x2, -500, "death"));
      waterDroplets.push(new component(finalweight2, finalweight2, "/images/WaterDropBad.png", x2, -1000, "death"));
    }
    //if loop for creating the Lives Droplets
    if(everyinterval(500)){
      x = myGameArea.canvas.width*Math.random();
      waterDroplets.push(new component(40, 40, "/images/WaterBucketLife.png", x, -120, "life"));
    }
    //if loop for creating the Score Droplets
    if (myGameArea.frameNo == 1 || everyinterval(Math.round(100*myGameArea.timer))) {
      x = myGameArea.canvas.width*Math.random();
      x2 = myGameArea.canvas.width*Math.random();
      x3 = myGameArea.canvas.width*Math.random();
      finalWeight = randomWeight(30,70);
      finalWeight2 = randomWeight(30,70);
      finalWeight3 =randomWeight(30,70);
      waterDroplets.push(new component(finalWeight, finalWeight, "/images/WaterDrop.png", x, -50, "score"));
      waterDroplets.push(new component(finalWeight2, finalWeight2, "/images/WaterDrop.png", x2, -200, "score"));
      waterDroplets.push(new component(finalWeight3, finalWeight3, "/images/WaterDrop.png", x3, -450, "score"));
    }
    for (i = 0; i < waterDroplets.length; i += 1) {
      waterDroplets[i].downspeed += waterDroplets[i].width/500;
      waterDroplets[i].newPos();
      waterDroplets[i].update();
    }
    scoreBoard.text="Score: " + Math.round(myGameArea.score);
    scoreBoard.update();
    livesBoard.text="Lives: " + myGameArea.lives;
    livesBoard.update();
    myGamePiece.newPos();
    myGamePiece.bucketWallCheck();
    myGamePiece.update();
}
//moves peice up
function moveup() {
    myGamePiece.upspeed = -7;
}
//moves peice down
function movedown() {
    myGamePiece.downspeed = 7;
}
//moves peice left
function moveleft() {
    myGamePiece.leftspeed = -7;
}
//moves peice right
function moveright() {
    myGamePiece.rightspeed = 7;
}

//function for updating image banner on mainpage
function mainStarter(){
  imgNo++;
  if(imgNo == mainImages.length) {
    imgNo = 0;
  }
  document.getElementById("images").src = mainImages[imgNo];
}
