class Sand{
    constructor(hx,hy,middle_pos){
        this.sprite=new Image();
        this.sprite.src = './textures/sand_original.jpg';
        this.hx=hx;
        this.hy=hy;
        this.middle_pos=middle_pos;
        this.shape = new b2PolygonShape();
        this.shape.SetAsBox(this.hx, this.hy);
        this.bodydef = new b2BodyDef();
        this.bodydef.set_type(b2_dynamicBody);
        this.bodydef.set_position(this.middle_pos);
        this. bodydef.set_userData(3);
        
        this.body = world.CreateBody(this.bodydef);
        
        this.fix = new b2FixtureDef();
        this.fix.set_shape(this.shape);
        this.fix.isSensor=true;
        this.body.CreateFixture(this.fix);
    }
}