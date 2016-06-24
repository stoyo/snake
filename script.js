// SNAKE

// SNAKE SETTINGS
var SQR_SIZE = 10;
var FRAMES = 100;

// SNAKE VARIABLES
var snakeSpeed = 50;
var moveCount = 0;
var snakeDirection = 38; //37 - left; 38 - up; 39 - right; 40 - down;

// OTHER VARS
var score = 0;

// TRAIL VARS
var xTrail = new Array();
var yTrail = new Array();
var snakeSize = 0;

// CREATE CANVAS
var c= document.getElementById("snakesquare");
var ctx=c.getContext("2d");
var canvWidth = c.width;
var canvHeight = c.height;

c.addEventListener('click',function(e){mouseHandle(e.offsetX,e.offsetY);},false);

// SNAKE POSITIONING;
var xSnake;
var ySnake;
var xpos;
var ypos;
resetPositions();

// FOOD POSITIONING
var xFood;
var yFood;

// BUTTON POSITIONS
var buttonPos = new Array();

// GAMESTATE
var gameState = 0;
var preState = gameState;

// ----------- GAME PLAY -----------------------------------------------------------------

menuStart();

var checkGs=self.setInterval(function(){checkGamestate(gameState)},20);

function checkGamestate(s){
    if(gameState != preState){
        switch(s)
        {
            case 0:
                menuStart();
                preState = 0;
                break;
            case 1:
                gameStart();
                preState = 1;
                break;
            case 2:
                pgStart();
                preState = 2;
                break;
            default:
        };
    };
};

// ----------- GAME FUNCTIONS ------------------------------------------------------------

// GAME FLOW
function gameStart(){
    var int=self.setInterval(function(){snakeAnimation()},snakeSpeed);

    function snakeAnimation(){
        if(moveCount == 0){
            clear();
            drawFirst();
            moveFood();
            drawFood();
            moveCount++;
        }else{
            clear();
            drawScore();
            setTrail();
            moveSnake(snakeDirection);
            drawSnake();

            if(wallCollision(xpos,ypos) || snakeCollision(xpos,ypos)){
                resetGame();
                int=window.clearInterval(int);
                gameState=2;
            };

            if(foodCollision(xpos,ypos)){
                addTrail();
                clearFood();
                drawSnake();
                moveFood();
                score++;
            };

            drawFood();
            moveCount++;
            drawScore();
        };
    };
};

// SCORE FUNCTIONS
function drawScore(){
    ctx.font="25px Arial";
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.textAlign="center";
    ctx.fillText(score,canvWidth/2,canvHeight/2);
};

// SNAKE FUNCTIONS
function drawSnake(){
    drawFirst();
    drawTrail();
};

function drawFirst(){
    ctx.clearRect(0,0,canvWidth,canvHeight);
    ctx.fillStyle="rgba(41,99,12,1)";
    ctx.fillRect(xpos,ypos,SQR_SIZE,SQR_SIZE);
};

function moveSnake(d){
    switch(d)
    {
        case 37:
            xSnake--;
            break;
        case 38:
            ySnake--;
            break;
        case 39:
            xSnake++;
            break;
        case 40:
            ySnake++;
            break;
        default:
    };
    xpos = xSnake*SQR_SIZE;
    ypos = ySnake*SQR_SIZE;
};

document.addEventListener('keydown',function(event){
    if(event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40){
        if(((event.which%2) == 0 && (snakeDirection%2) != 0)){
            snakeDirection = event.which;
        }else if(((event.which%2) != 0 && (snakeDirection%2) == 0)){
            snakeDirection = event.which;
        };
    };
});

function resetPositions(){
    xSnake = (canvWidth/SQR_SIZE)/2;
    ySnake = (canvHeight/SQR_SIZE)/2;
    xpos = xSnake*SQR_SIZE;
    ypos = ySnake*SQR_SIZE;
};

// TRAIL FUNCTIONS
function addTrail(){
    xTrail.push(xTrail[xTrail.length-1]);
    yTrail.push(yTrail[yTrail.length-1]);
};

function setTrail(){
    var i=xTrail.length;
    var xTemp;
    var yTemp
    while(i>0){
        xTrail[i] = xTrail[i-1];
        yTrail[i] = yTrail[i-1];
        i--;
    };
    xTrail.pop();
    yTrail.pop();
    xTrail[0] = xpos;
    yTrail[0] = ypos;
};

function drawTrail(){
    for(var a=0;a<xTrail.length;a++){
        ctx.fillStyle="rgba(0,255,0,1)";
        ctx.fillRect(xTrail[a],yTrail[a],SQR_SIZE,SQR_SIZE);
    };
};

// FOOD FUNCTIONS
function clearFood(){
    ctx.clearRect(xFood,yFood,SQR_SIZE,SQR_SIZE);
};

function moveFood(){
    do{
        xFood = (Math.floor(Math.random()*((canvWidth/SQR_SIZE)-SQR_SIZE))+1)*SQR_SIZE;
        yFood = (Math.floor(Math.random()*((canvHeight/SQR_SIZE)-SQR_SIZE))+1)*SQR_SIZE;
    }
    while (snakeCollision(xFood,yFood));
};

function drawFood(){
    ctx.fillStyle="rgba(255,255,0,1)";
    ctx.fillRect(xFood,yFood,SQR_SIZE,SQR_SIZE);
};

// COLLISION CHECKS	
function wallCollision(xsource,ysource){
    if(xsource == canvWidth || xsource == 0-SQR_SIZE){
        return true;
    }else if(ysource == canvHeight || ysource == 0-SQR_SIZE){
        return true;
    };
};

function foodCollision(xsource,ysource){
    if(xsource == xFood && ysource == yFood){
        return true;
    };
};

function snakeCollision(xsource,ysource){
    for(var i=0;i<xTrail.length;i++){
        if(xsource == xTrail[i] && ysource == yTrail[i]){
            return true;
        };
    };
};

// RESET FUNCTIONS

function resetGame(){
    resetPositions();
    xTrail = [];
    yTrail = [];
    moveCount = 0;
};

// ----------- POST GAME FUNCTIONS -------------------------------------------------------

// PG START
function pgStart(){
    clear();

    ctx.font="25px Arial";
    ctx.fillStyle="rgba(0,0,0,1)";
    ctx.textAlign="center";
    ctx.fillText('GAME OVER',canvWidth/2,canvHeight/2-30);

    ctx.font="25px Arial";
    ctx.fillStyle="rgba(0,0,0,1)";
    ctx.textAlign="center";
    ctx.fillText('SCORE: '+score,canvWidth/2,canvHeight/2);

    drawButton(getCenterX(100),getCenterY(50)+35,100,50,"Again",1);
};

// ----------- MENU FUNCTIONS ------------------------------------------------------------

// MENU START
function menuStart(){
    clear();
    drawButton(getCenterX(100),getCenterY(50),100,50,"Go",0);
};

// CLEAR SCREEN
function clear(){
    ctx.clearRect(0,0,canvWidth,canvHeight);
};

// DRAW BUTTON
function drawButton(x,y,width,height,string,event){
    xCenterButton=x+(width/2);
    yCenterButton=y+(height/2);

    ctx.fillStyle="rgba(0,0,0,1)";
    ctx.fillRect(x-1,y-1,width+2,height+2);

    ctx.fillStyle="rgba(242,255,195,1)";
    ctx.fillRect(x,y,width,height);

    ctx.font="25px Arial";

    fontSize = getFontSize();
    centerNum = fontSize/4;

    ctx.fillStyle="rgba(0,0,0,1)";
    ctx.textAlign="center";
    ctx.fillText(string,xCenterButton,yCenterButton+centerNum);

    buttonPos.push([[x],[y],[x+width],[y+height],[event]]);
};

// BUTTON EVENTS
function eventButton(d){
    var buttonInt = parseInt(d);
    switch(buttonInt){
        case 0: // STARTBUTTON
            if(gameState == 0){
                gameState = 1;
            };
            break;
        case 1:
            if(gameState == 2){
                score = 0;
                gameState = 1;
            };
            break;
        default:
            alert("Error: No button in place.");
    };
};

// BUTTON CLICK
function mouseHandle(x,y){
    for(var i=0; i<buttonPos.length; i++){
        if(x>buttonPos[i][0] && x<buttonPos[i][2]){
            if(y>buttonPos[i][1] && y<buttonPos[i][3]){
                eventButton(buttonPos[i][4]);
            };
        };
    };
};

// GET FONT SIZE
function getFontSize(){
    fontSizeArray = new Array();
    fontString = ctx.font;
    fInstance = fontString.indexOf("px");
    for(var i=0;i<fInstance;i++){
        fontSizeArray[i] = fontString[i];
    };
    fontSize = fontSizeArray.join("");
    return fontSize;
};

// CANVAS CENTER
function getCenterX(width){
    canvCenter = canvWidth/2;
    widthCenter = width/2;
    x = canvCenter - widthCenter;
    return x;
};

function getCenterY(height){
    canvCenter = canvHeight/2;
    heightCenter = height/2;
    y = canvCenter - heightCenter;
    return y;
};