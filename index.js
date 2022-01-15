var e_shapeBit = 0x0001;
var e_jointBit = 0x0002;
var e_aabbBit = 0x0004;
var e_pairBit = 0x0008;
var e_centerOfMassBit = 0x0010;

var PTM = 32;
const NUM_LEVELS = 18;
var max_lvl = localStorage.getItem("level");

var world = null;
var canvas;
var context;
var myDebugDraw;        
var myQueryCallback;      
var run = true;      
var mouseDown = false;    
var mousePosPixel = {
    x: 0,
    y: 0
};
var prevMousePosPixel = {
    x: 0,
    y: 0
};        
var mousePosWorld = {
    x: 0,
    y: 0
};        
var canvasOffset = {
    x: 0,
    y: 0
};        
var viewCenterPixel = {
    x:320,
    y:240
};
var currentTest = null;
var ballPlaced = false;

function myRound(val,places) {
    var c = 1;
    for (var i = 0; i < places; i++)
        c *= 10;
    return Math.round(val*c)/c;
}
        
function getWorldPointFromPixelPoint(pixelPoint) {
    return {                
        x: (pixelPoint.x - canvasOffset.x)/PTM,
        y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
    };
}

function getPixelPointFromWorldPoint(worldPoint) {
    return {                
        x: worldPoint.x*PTM+canvasOffset.x,
        y: canvas.height -(worldPoint.y*PTM+(canvas.height - canvasOffset.y))
    };
}

function setViewCenterWorld(b2vecpos, instantaneous) {
    var cvs=document.getElementById('canvas');
    viewCenterPixel = {
        x:cvs.width/2,
        y:cvs.height/2
    };

    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    var toMoveX = b2vecpos.get_x() - currentViewCenterWorld.x;
    var toMoveY = b2vecpos.get_y() - currentViewCenterWorld.y;
    var fraction = instantaneous ? 1 : 0.25;
    canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
    canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);
}


function onMouseDown(canvas, evt) {
    updateMousePos(canvas, evt);
    currentTest.onMouseDown(canvas, evt);
    if(!ballPlaced){
        placeBallInSpawn();
    }
}

function collideCircles(obj1,obj2){

}

function clickCollideRect(obj){
    return mousePosWorld.x >= obj.middle_pos.x-obj.hx
            && mousePosWorld.x <= obj.middle_pos.x+obj.hx
            && mousePosWorld.y >= obj.middle_pos.y-obj.hy
            && mousePosWorld.y <= obj.middle_pos.y+obj.hy;
}

function placeBallInSpawn(){
    var spawn_area;
    for(var i = 0 ; i < currentTest.level.obstacles['spawn'].length ; ++i){
        if(clickCollideRect(currentTest.level.obstacles['spawn'][i])){
            spawn_area = currentTest.level.obstacles['spawn'][i];
            break;
        }
    }
    if(spawn_area === undefined){
        return;
    }
    currentTest.balls.push(new Ball(new b2Vec2(mousePosWorld.x,mousePosWorld.y), currentTest.balls.length));
    ballPlaced = true;
}

function onMouseUp(canvas, evt) {
    mouseDown = false;
    updateMousePos(canvas, evt);
    currentTest.onMouseUp(canvas, evt);
}

function onMouseMove(canvas, evt) {
    updateMousePos(canvas, evt);
}

function onTouchDown(canvas, evt) {            
    updateMousePos(canvas, evt);
    currentTest.onTouchDown(canvas, evt);
}

function onTouchUp(canvas, evt) {
    mouseDown = false;
    updateMousePos(canvas, evt);
    currentTest.onTouchUp(canvas, evt);
}


function updateMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    if(evt.clientX !== undefined){
        mousePosPixel = {
            x: evt.clientX - rect.left,
            y: canvas.height - (evt.clientY - rect.top)
        };
    }else{
        if(evt.clientX === undefined && evt.touches.length !== 0){
            mousePosPixel = {
                x: evt.touches[0].clientX - rect.left,
                y: canvas.height - (evt.touches[0].clientY - rect.top)
            };
        }else{
            mousePosPixel = {
                x: evt.changedTouches[0].clientX - rect.left,
                y: canvas.height - (evt.changedTouches[0].clientY - rect.top)
            };
        }
    }
    mousePosWorld = getWorldPointFromPixelPoint(mousePosPixel);
}

function onTouchMove(evt) {
    currentTest.onTouchMove(canvas, evt);
    updateMousePos(canvas, evt);
}


function init() {
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext( '2d' );
    
    canvasOffset.x = canvas.width/2;
    canvasOffset.y = canvas.height/2;

    canvas.addEventListener("touchstart", function(evt){
        onTouchDown(canvas,evt);
    },false);

    canvas.addEventListener("touchend", function(evt){
        onTouchUp(canvas,evt);
    },false);

    canvas.addEventListener('touchmove', function(evt){
        onTouchMove(evt);
    }, false); // mobile
    
    canvas.addEventListener('mousedown', function(evt) {
        onMouseDown(canvas,evt);
    }, false);
    
    canvas.addEventListener('mouseup', function(evt) {
        onMouseUp(canvas,evt);
    }, false);

    canvas.addEventListener('mousemove', function(evt) {
        onMouseMove(canvas,evt);
    }, false);

    
    myDebugDraw = getCanvasDebugDraw();            
    myDebugDraw.SetFlags(e_shapeBit);
    
    myQueryCallback = new Box2D.JSQueryCallback();

    myQueryCallback.ReportFixture = function(fixturePtr) {
        var fixture = Box2D.wrapPointer( fixturePtr, b2Fixture );
        if ( fixture.GetBody().GetType() != Box2D.b2_dynamicBody ) //mouse cannot drag static bodies around
            return true;
        if ( ! fixture.TestPoint( this.m_point ) )
            return true;
        this.m_fixture = fixture;
        return false;
    };
}

function changeTest() {    
    resetScene();
    if ( currentTest && currentTest.setNiceViewCenter ){
        currentTest.setNiceViewCenter();
    }
    draw();
}

function createWorld() {
    if ( world != null ) 
        Box2D.destroy(world);
        
    world = new Box2D.b2World( new Box2D.b2Vec2(0.0, 0.0) );
    world.SetDebugDraw(myDebugDraw);

    eval( "currentTest = new golfux();" );
    
    currentTest.setup();
}

function resetScene() {
    createWorld();
    draw();
}

function step() { // Equivalent d'update
    world.Step(1/60, 3, 2);
    draw();
    currentTest.step();
}

function draw() {
    context.fillStyle = 'rgb(0,153,0)';
    context.fillRect( 0, 0, canvas.width, canvas.height );
    
    context.save();            
    context.translate(canvasOffset.x, canvasOffset.y);
    context.scale(1,-1);                
    context.scale(PTM,PTM);
    context.lineWidth /= PTM;
    
    drawAxes(context);
    
    context.fillStyle = 'rgb(255,255,0)';
    //world.DrawDebugData(); // Affichage des éléments de débugage
        
    context.restore();
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();

function animate() {
    if ( run )
        requestAnimFrame( animate );
    step();
}

/* ECOUTEURS INTERFACES */

document.addEventListener("DOMContentLoaded", function() {
    //Création levels dynamiques
    create_levels_btn(NUM_LEVELS);
    //Progression
    if (localStorage.getItem("level") == null) {
        save_progression(1);
    }
    
    //Mode Solo
    document.getElementById("play-solo").addEventListener('click', function(e){
        display_title(false);
        document.getElementById("solo").style.display = "block";
    });

    //Liste niveaux 
    document.getElementById("levels").addEventListener('click', function(e) {
        if (e.target.dataset["index"] != undefined) {
            if (e.target.dataset["index"] <= max_lvl) {
                document.getElementById("solo").style.display = "none";
                //Charger level X
                document.getElementById("game").style.display = "block";
            } else {
                alert("Vous n'avez pas encore débloqué ce niveau.");
            }
        }
    });

    //Multi Local
    document.getElementById("multi-local").addEventListener('click', function(e){
        display_title(false);
    });

    //Multi Online
    document.getElementById("multi-online").addEventListener('click', function(e){
        display_title(false);
    });

    //Retour
    document.querySelector(".retour").addEventListener('click', function(e){
        document.getElementById("solo").style.display = "none";
        display_title();
    });

    function display_title(display=true) {
        if (display == false) {
            document.getElementById("menu").style.display = "none";
            document.querySelector("header").style.display = "none";
            document.querySelector("footer").style.display = "none";
        } else {
            document.getElementById("menu").style.display = "block";
            document.querySelector("header").style.display = "block";
            document.querySelector("footer").style.display = "block";
        }
    }

    function create_levels_btn(lvl_number) {
        var levels = document.getElementById("levels");
        for(var i = 0; i < lvl_number; i++) {
            var button = document.createElement("button");
            button.dataset["index"] = i+1;
            var content;
            if (i+1 <= max_lvl) {
                content = i+1;
                button.classList.add("unlock");
            } else {
                content = "\uD83D\uDD12";
            }
            var txt = document.createTextNode(content);
            button.appendChild(txt);
            levels.appendChild(button);
        }
    }

    function save_progression(last_lvl) {
        var progress = localStorage.getItem("level");
        progress = (!progress) ? {} : JSON.parse(progress);
        progress = last_lvl;
        localStorage.setItem("level", JSON.stringify(progress));
    }
});