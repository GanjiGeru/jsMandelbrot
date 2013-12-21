function Mandelbrot(width, height) {
    this.setSize(width, height);

    this.presentation = new PMandelbrot(this);

    this.imageCoordinate = ImageCoordinate.defaultCoordinate();
    this.aabb = new AaBb();
    this.updateAaBb();
    this.updateData();

    //console.log(new Complex(1, 2).arctanh().mul(new Complex(1, 2)));
    //this.algorithm = (this.gl ? null : new ArctanhAlgorithm());
    this.algorithm = (this.gl ? null : new BasicAlgorithm());

    this.update();
}

Mandelbrot.prototype.updateAaBb = function() {
    this.aabb.setWidth(this.width / this.imageCoordinate.zoom);
    this.aabb.setHeight(this.height / this.imageCoordinate.zoom);
    this.aabb.centerOn(this.imageCoordinate.x, this.imageCoordinate.y);
}

Mandelbrot.prototype.process = function() {
    var t0 = Date.now();

    if(this.gl == null) {
        this.algorithm.process(this.width, this.height, this.aabb, this.imageCoordinate, this.data);
    } else {
        this.glRenderer.initShaders()
        this.glRenderer.initBuffers();

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.glRenderer.drawScene(this.aabb);
    }

    var t1 = Date.now();
    console.log("Processed in "+(t1-t0)+" ms");
}

Mandelbrot.prototype.setGl = function(gl) {
    this.gl = gl;
    if(this.gl != null) {
        this.glRenderer = new GlRenderer(gl);
    }
}

Mandelbrot.prototype.zoom = function(zoomIn, cursor) {
    var pointX = cursor.x/this.imageCoordinate.zoom + this.aabb.minX;
    var pointY = cursor.y/this.imageCoordinate.zoom + this.aabb.minY;

    var newZoom =  (zoomIn ? this.imageCoordinate.zoom*1.5 : this.imageCoordinate.zoom/1.5);

    var newWidth = this.width/newZoom;
    var newHeight = this.height/newZoom;
    var oldWidth = this.aabb.getWidth();
    var oldHeight = this.aabb.getHeight();

    //On fait en sorte que le curseur de la souris continue de pointer sur le même point de la carte
    var ratioX = (pointX - this.aabb.minX) / this.aabb.getWidth();
    var ratioY = (pointY - this.aabb.minY) / this.aabb.getHeight();

    this.aabb.minX = pointX - ratioX*newWidth;
    this.aabb.minY = pointY - ratioY*newHeight;

    //Nouvelles dimensions
    this.aabb.setWidth(newWidth);
    this.aabb.setHeight(newHeight);

    //Nouveau zoom
    this.imageCoordinate.zoom = newZoom;

    this.updateXAndY();
    this.update();
}

Mandelbrot.prototype.update = function() {
    this.process();
    if(this.gl == null) {
        this.presentation.updateCoords(this.imageCoordinate);
        this.presentation.repaint();
    }
}

Mandelbrot.prototype.moveAaBb = function(x, y) {
    this.aabb.move(x/this.imageCoordinate.zoom, y/this.imageCoordinate.zoom);
    this.updateXAndY();
    this.update();
}

Mandelbrot.prototype.updateXAndY = function() {
    this.imageCoordinate.x = (this.aabb.maxX + this.aabb.minX) / 2;
    this.imageCoordinate.y = (this.aabb.maxY + this.aabb.minY) / 2;
}

Mandelbrot.prototype.updateData = function() {
    this.data = new Array();
    for(var i=0; i<this.width; i++) {
        this.data[i] = new Array();
    }
}

Mandelbrot.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
}

Mandelbrot.prototype.resize = function(width, height) {
    this.setSize(width, height);
    this.updateAaBb();
    this.updateData();
    this.presentation.updateSize();
    this.update();
}