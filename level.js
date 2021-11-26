class Level{
    constructor(){
        this.obstacles={
            walls:[],
            sand:[],
            bubblegum:[],
            void:[],
            bumper:[]
        };
        this.hole = null;
    }

    createHole(radius, middle_pos){
        this.hole = new Hole();
        this.hole.setPos(middle_pos);
        this.hole.setRadius(radius);
        this.hole.createHole();
    }

    createWall(middle_pos,shape,userdata,isstatic,hx,hy,radius,vectrices){
        this.obstacles["walls"].push(new Wall(middle_pos,shape,userdata,isstatic,hx,hy,radius,vectrices));
    }

    createBumper(middle_pos,shape,userdata,isstatic,hx,hy,radius,vectrices){
        this.obstacles["bumper"].push(new Wall(middle_pos,shape,userdata,isstatic,hx,hy,radius,vectrices));
    }

    initBasicWalls() {
        this.createWall(new b2Vec2(9.5,0), 'box', -1, true, 9.25, 0.25, -1, -1); // Bas
        this.createWall(new b2Vec2(9.5, 24), 'box', -1, true, 9.25, 0.25, -1, -1); // Haut
        this.createWall(new b2Vec2(0, 12), 'box', -1, true, 0.25, 12.25, -1, -1); // Gauche 
        this.createWall(new b2Vec2(19, 12), 'box', -1, true, 0.25, 12.25, -1, -1); // Droite
        this.createWall(new b2Vec2(10, 12), 'box', -1, true, 4.25, 0.25, -1, -1); // Centre
        this.createBumper(new b2Vec2(10, 6), 'circle', -1, true, -1, -1, 1, -1);
        this.createSand(new b2Vec2(3, 12), 'box', 3, 3, 2,-1,-1);
        this.createBubblegum(new b2Vec2(16, 12), 'box', 4, 3, 2,-1,-1);
        this.createVoid(new b2Vec2(9.5, 11), 'box', 5, 3.5, 1,-1,-1);
    }

    createSand(middle_pos,shape,userdata,hx,hy,radius,vectrices){//middle_pos,shape,userdata,hx,hy,radius,vectrices
        this.obstacles["sand"].push(new Sand(middle_pos,shape,userdata,hx,hy,radius,vectrices));
    }

    createBubblegum(middle_pos,shape,userdata,hx,hy,radius,vectrices){
        this.obstacles["bubblegum"].push(new Bubblegum(middle_pos,shape,userdata,hx,hy,radius,vectrices));
    }

    createVoid(middle_pos,shape,userdata,hx,hy,radius,vectrices){
        this.obstacles["void"].push(new Void(middle_pos,shape,userdata,hx,hy,radius,vectrices));
    }
    
}