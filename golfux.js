var MAX_INTENSITIE=10;
var MAX_NORME = 255;
var shot = false;
var moving = false;
var click_start = {x: 0, y: 0};
var old_ball_pos = {x: 0, y: 0};
var ball_pos;
var click_pos;
var norme;

var golfux = function() {
    //constructor
    this.click_down=null;
    this.click_up=null;
    this.ball = new Ball();
    this.level = new Level();
    this.level.initBasicWalls();
    this.level.test();
    
}

golfux.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 32;
    setViewCenterWorld( new b2Vec2(9.5,7), true );
}

golfux.prototype.setup = function() {

}

golfux.prototype.onTouchDown = function(canvas, evt) {
    // Récuperation de la position du click
    let rect = canvas.getBoundingClientRect();
    let x = evt.touches[0].clientX - rect.left;
    let y = evt.touches[0].clientY - rect.top;
    this.click_down={x:x,y:canvas.height-y};
    this.click_down=getWorldPointFromPixelPoint(this.click_down);
}


golfux.prototype.onTouchUp = function(canvas, evt) {
    // Récuperation de la position de relachement du click
    let rect = canvas.getBoundingClientRect();
    let x = evt.changedTouches[0].clientX  - rect.left;
    let y = evt.changedTouches[0].clientY  - rect.top;
    this.click_up={x:x,y:canvas.height-y};
    this.click_up=getWorldPointFromPixelPoint(this.click_up);
    
    var impulse={
        x:this.click_down.x-this.click_up.x,
        y:this.click_down.y-this.click_up.y
    };

    // Intensification en fonction de l'éloignement par rapport au click initial (valuer à changer)
    var intensifie=Math.sqrt(impulse.x*impulse.x + impulse.y*impulse.y);
    if(intensifie>MAX_INTENSITIE){
        intensifie=MAX_INTENSITIE;
    }
    // Impulsion
    this.ball.body.ApplyLinearImpulse(new b2Vec2(impulse.x*intensifie, impulse.y*intensifie),true);
}

golfux.prototype.onMouseDown = function(canvas, evt) {
    // Récuperation de la position du click
    let rect = canvas.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    this.click_down={x:x,y:canvas.height-y};
    this.click_down=getWorldPointFromPixelPoint(this.click_down);

    click_start.x = x;
    click_start.y = y;

    shot = true;
}

golfux.prototype.onMouseUp = function(canvas, evt) {
    // Récuperation de la position de relachement du click
    let rect = canvas.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    this.click_up={x:x,y:canvas.height-y};
    this.click_up=getWorldPointFromPixelPoint(this.click_up);
    
    var impulse={
        x:this.click_down.x-this.click_up.x,
        y:this.click_down.y-this.click_up.y
    };

    // Intensification en fonction de l'éloignement par rapport au click initial (valuer à changer)
    var intensifie=Math.sqrt(impulse.x*impulse.x + impulse.y*impulse.y);
    if(intensifie>MAX_INTENSITIE){
        intensifie=MAX_INTENSITIE;
    }
    // Impulsion
    if (moving == false) {
        this.ball.body.ApplyLinearImpulse(new b2Vec2(impulse.x*intensifie, impulse.y*intensifie),true);
    }
    this.click_up=null;
    this.click_down=null;

    shot = false;
    moving = true;
}

golfux.prototype.onTouchDown = function(canvas, evt) {
    // Récuperation de la position du click
    let rect = canvas.getBoundingClientRect();
    let x = evt.touches[0].clientX - rect.left;
    let y = evt.touches[0].clientY - rect.top;
    this.click_down={x:x,y:canvas.height-y};
    this.click_down=getWorldPointFromPixelPoint(this.click_down);
}

golfux.prototype.onTouchUp = function(canvas, evt) {
    // Récuperation de la position de relachement du click
    let rect = canvas.getBoundingClientRect();
    let x = evt.changedTouches[0].clientX  - rect.left;
    let y = evt.changedTouches[0].clientY  - rect.top;
    this.click_up={x:x,y:canvas.height-y};
    this.click_up=getWorldPointFromPixelPoint(this.click_up);
    
    var impulse={
        x:this.click_down.x-this.click_up.x,
        y:this.click_down.y-this.click_up.y
    };

    // Intensification en fonction de l'éloignement par rapport au click initial (valuer à changer)
    var intensifie=Math.sqrt(impulse.x*impulse.x + impulse.y*impulse.y);
    if(intensifie>MAX_INTENSITIE){
        intensifie=MAX_INTENSITIE;
    }
    // Impulsion
    if (moving == false) {
        this.ball.body.ApplyLinearImpulse(new b2Vec2(impulse.x*intensifie, impulse.y*intensifie),true);
    }
}

golfux.prototype.onTouchMove = function(evt) {
    evt.preventDefault();
}

var wall_sprite=new Image();
wall_sprite.src = './textures/wall.jpg';

golfux.prototype.step = function(){
    this.ball.x=this.ball.body.GetPosition().x;
    this.ball.y=this.ball.body.GetPosition().y;
    var cvs=document.getElementById('canvas');
    var context = cvs.getContext( '2d' );

    var pos = getPixelPointFromWorldPoint({x:this.ball.x,y:this.ball.y});
    context.drawImage(this.ball.sprite, pos.x-10, cvs.height-pos.y-10,20,20);

    context.fillStyle = '#FF0000';
    
    // Walls
    var pattern = context.createPattern(wall_sprite, 'repeat');
    context.fillStyle = pattern;
    for(let i=0,l=this.level.walls.length;i<l;++i){
        var world_pos_wall=this.level.walls[i].wall.GetPosition();
        var leftup_corner={
            x:world_pos_wall.x-this.level.walls[i].hx,
            y:world_pos_wall.y-this.level.walls[i].hy
        };
        var wall_pos_canvas = getPixelPointFromWorldPoint(leftup_corner);
        context.fillRect(wall_pos_canvas.x, wall_pos_canvas.y, this.level.walls[i].hx*PTM*2, this.level.walls[i].hy*PTM*2);
    }

    ball_pos = {x: pos.x, y: cvs.height-pos.y};
    //Si la balle ne bouge plus, on peut de nouveau tirer
    if (this.ball.body.GetLinearVelocity().Length() < 1) {
        moving = false;
    } else {
        moving = true;
    }

    //Segment
    var segment = compute_segment();

    //Si on tire en fait
    if (segment[0] && segment[1] && shot == true && moving == false) {
        context.beginPath();
        print_segment(segment[0].x, segment[0].y, segment[1].x, segment[1].y);
        context.stroke();
    }

    function compute_segment() {
        var segment = Array();

        click_pos = {x: mousePosPixel.x, y: cvs.height-mousePosPixel.y};
        var final_pos = compute_final_point(click_pos);

        norme = Math.sqrt(Math.pow(click_start.x - click_pos.x, 2) + Math.pow(click_start.y - click_pos.y, 2));
        segment[0] = ball_pos;
        segment[1] = final_pos;

        //Restriction norme
        if (norme > MAX_NORME){
            var eq = get_equation_droite(segment[0], segment[1]);
            var sol = solve_equation(eq, segment[0], segment[1]);
            segment[1] = sol;
        }
        return segment;
    }

    function get_equation_droite(p1, p2) {
        var m = (p2.y - p1.y) / (p2.x - p1.x);
        var p = p1.y - m * p1.x
        return {m: m, p: p};
    }

    function solve_equation(eq, p1, p2) {
        var xA = p1.x;
        var yA = p1.y;
        var d = MAX_NORME;
        //Deux solutions
        var xB_1 = (xA + yA*eq.m - eq.m*eq.p) / (eq.m*eq.m + 1) - Math.sqrt((-xA*xA*eq.m*eq.m + 2*xA*yA*eq.m - 2*xA*eq.m*eq.p - yA*yA + 2*yA*eq.p + d*d*eq.m*eq.m + d*d - eq.p*eq.p) / Math.pow(eq.m*eq.m + 1, 2));
        var xB_2 = Math.sqrt((-xA*xA*eq.m*eq.m + 2*xA*yA*eq.m - 2*xA*eq.m*eq.p - yA*yA + 2*yA*eq.p + d*d*eq.m*eq.m + d*d - eq.p*eq.p) / Math.pow(eq.m*eq.m + 1, 2)) + (xA + yA*eq.m - eq.m*eq.p) / (eq.m*eq.m + 1);
        var xC = p2.x;
        //On choisi la bonne solution (celle la plus proche du point C)
        var xB = (Math.abs(xC - xB_1) > Math.abs(xC - xB_2))? xB_2 : xB_1;
        //On en déduit yB
        var yB = eq.m * xB + eq.p;
        return {x: xB, y: yB};
    }

    function compute_final_point(click_pos) {
        var diff_pos = {x: Math.abs(click_pos.x - click_start.x), y: Math.abs(click_pos.y - click_start.y)};
        var final_pos = {x: ball_pos.x, y: ball_pos.y};
        if (click_pos.x > click_start.x) {
            final_pos.x -= diff_pos.x;
        } else {
            final_pos.x += diff_pos.x;
        }
        if (click_pos.y > click_start.y) {
            final_pos.y -= diff_pos.y;
        } else {
            final_pos.y += diff_pos.y;
        }
        return final_pos;
    }
    
    //Fonction pour print la flèche (trucs mystiques pour le bout tkt)
    function print_segment(fromx, fromy, tox, toy) {
        var final_norme = (norme > MAX_NORME)? MAX_NORME : norme;
        var percents = (100 * final_norme) / 255;
        var color = "rgb(255, "+(255 - final_norme)+", 0)";
        context.fillStyle = color;
        context.strokeStyle = color;
        context.font = "bold 20px comic sans ms";
        context.fillText(Math.trunc(percents)+"%", (tox + fromx)/2 - 15, (toy + fromy)/2 - 15);
        context.lineWidth = 2;
        var headlen = 10; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    }
}