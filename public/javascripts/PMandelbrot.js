function PMandelbrot(controller) {
    this.controller = controller;
    this.colorList = ColorList.PRESET2.clone();

    this.colorPanel = new ColorPanel(this.colorList);
    this.imageControl = new ImageControlPanel(this);

    this.canvas = $("#canvas");
    this.choseCanvasContext();

    this.controller.setGl(this.isGlContext ? this.context : null);

    this.registerEvents();

    this.updateSize();
}

PMandelbrot.prototype.repaint = function() {
    this.paint2d();
}

PMandelbrot.prototype.paint2d = function() {
    //var colorStep = 255 / this.controller.imageCoordinate.maxIter;
    console.log(this.canvas[0].height+" ; "+this.controller.height);

    var px;
    var step1 =(this.canvas[0].width*Math.floor((this.canvas[0].height-this.controller.height)/2)+Math.floor((this.canvas[0].width-this.controller.width)/2))*4;//(this.canvas[0].height-this.controller.height) *this.canvas[0].width*4;
    for(px = 0; px<step1; px+=4) {
        this.imageData.data[px] = 220;
        this.imageData.data[px+1] = 220;
        this.imageData.data[px+2] = 220;
        this.imageData.data[px+3] = 255;
    }

    var step2 = (this.canvas[0].width - this.controller.width)*4;

    for(var j=0; j<this.controller.height; j++) {
        for(var i=0; i<this.controller.width; i++) {
            /*this.imageData.data[px] = this.controller.data[i][j] * colorStep;
            this.imageData.data[px+1] = 0;
            this.imageData.data[px+2] = 0;*/

            var color = this.getColor(this.controller.data[i][j], this.controller.imageCoordinate.maxIter);
            this.imageData.data[px] = color.r;
            this.imageData.data[px+1] = color.g;
            this.imageData.data[px+2] = color.b;
            this.imageData.data[px+3] = 255;

            px += 4;
        }

        for(var k=0; k<step2; k+=4) {
            this.imageData.data[px] = 220;
            this.imageData.data[px+1] = 220;
            this.imageData.data[px+2] = 220;
            this.imageData.data[px+3] = 255;
            px += 4;
        }
    }

    for(; px<this.imageData.data.length; px+=4) {
        this.imageData.data[px] = 220;
        this.imageData.data[px+1] = 220;
        this.imageData.data[px+2] = 220;
        this.imageData.data[px+3] = 255;
    }

    this.context.putImageData(this.imageData, 0, 0);
}

PMandelbrot.prototype.choseCanvasContext = function() {
    try {
        this.context = this.canvas[0].getContext("experimental-webgl");
        this.context.viewportWidth = this.canvas[0].width;
        this.context.viewportHeight = this.canvas[0].height;
        this.isGlContext = true;
    } catch(e) {
        console.log("Could not initialise WebGL, switching to 2d context");
        this.context = this.canvas[0].getContext("2d");
        this.isGlContext = false;
    }
}

PMandelbrot.prototype.getPoint = function(e) {
    return {x : e.pageX-$("#canvas")[0].offsetLeft, y : e.pageY-$("#canvas")[0].offsetTop};
}

PMandelbrot.prototype.registerEvents = function() {
    this.viewMoved = false;
    this.pressedPoint = null;

    var pMandelbrot = this;

    this.canvas.mousedown(function(e) {
        pMandelbrot.pressedPoint = pMandelbrot.getPoint(e);
        pMandelbrot.pressedMouseButton = e.button;
    });

    $("#canvas, #hidingBordersDiv div").mouseup(function(e) {
        var point = pMandelbrot.getPoint(e);
        if(pMandelbrot.viewMoved && pMandelbrot.pressedPoint.x != point.x || pMandelbrot.pressedPoint.y != point.y) {
            pMandelbrot.controller.moveAaBb(pMandelbrot.pressedPoint.x - point.x, pMandelbrot.pressedPoint.y - point.y);
        }
        pMandelbrot.pressedPoint = null;
        pMandelbrot.viewMoved = false;
        pMandelbrot.pressedMouseButton = null;
    });

    $("#canvas, #hidingBordersDiv div").mousemove(function(e) {
        var point = pMandelbrot.getPoint(e);
        if(pMandelbrot.pressedMouseButton == 0) {
            pMandelbrot.viewMoved = true;
            pMandelbrot.movingView(point.x-pMandelbrot.pressedPoint.x, point.y-pMandelbrot.pressedPoint.y);
        } else {
            pMandelbrot.pressedPoint = point;
        }
    });

    this.canvas.on("wheel", function(e) {
        if(pMandelbrot.pressedMouseButton == null) {
            var xDiff = Math.floor((pMandelbrot.canvas[0].width-pMandelbrot.controller.width)/2);
            var yDiff = Math.floor((pMandelbrot.canvas[0].height-pMandelbrot.controller.height)/2);
            if(pMandelbrot.pressedPoint.x >= xDiff && pMandelbrot.pressedPoint.x < xDiff+pMandelbrot.controller.width &&
                pMandelbrot.pressedPoint.y >= yDiff && pMandelbrot.pressedPoint.y < yDiff+pMandelbrot.controller.height) {

                pMandelbrot.controller.zoom(e.deltaY < 0, pMandelbrot.convertPointForController(pMandelbrot.pressedPoint));
            }
        }
    });

    $(window).keypress(function(e) {
        switch(e.charCode) {
            case 122:
                pMandelbrot.controller.imageCoordinate.maxIter = Math.ceil(pMandelbrot.controller.imageCoordinate.maxIter*1.1);
                pMandelbrot.controller.update();
                break;
            case 115:
                pMandelbrot.controller.imageCoordinate.maxIter = Math.max(1, Math.floor(pMandelbrot.controller.imageCoordinate.maxIter/1.1));
                pMandelbrot.controller.update();
                break;
        }
    });

    $(window).resize(function() {
        pMandelbrot.updateSize();
        pMandelbrot.resizeController();
    });
}

PMandelbrot.prototype.movingView = function(x, y) {
    if(!this.isGlContext) {
        this.context.fillStyle = "#aaa";
        this.context.rect(0, 0, this.controller.width, this.controller.height);
        this.context.fill();
        this.context.putImageData(this.imageData, x, y);
    }
}

PMandelbrot.prototype.updateSize = function() {
    this.canvas[0].width = $(window).width()-200;
    this.canvas[0].height = $(window).height()-150;
    $("#topDiv").width($(window).width()-200);
    $("#rightDiv .colorListPanelDiv").height($(window).height()-150);
    $("#hidingBordersDiv .top, #hidingBordersDiv .bottom").css("width", $(window).width()-200);
    $("#hidingBordersDiv .left, #hidingBordersDiv .right").css("height", $(window).height()-150);

    if(this.isGlContext) {

    } else {
        this.imageData = this.context.createImageData(this.canvas[0].width, this.canvas[0].height);
    }
}

PMandelbrot.prototype.updateCoords = function(imageCoordinate) {
    $("#topDiv .coordinatesDiv .x .value").text(imageCoordinate.x);
    $("#topDiv .coordinatesDiv .y .value").text(imageCoordinate.y);
    $("#topDiv .coordinatesDiv .zoom .value").text(imageCoordinate.zoom);
    $("#topDiv .coordinatesDiv .maxIter .value").text(imageCoordinate.maxIter);
    $("#topDiv .coordinatesDiv .escapeRadius .value").text(imageCoordinate.escapeRadius);
}

PMandelbrot.prototype.getColor = function(nbIter, maxIter) {
    if(nbIter == maxIter) {
        return this.colorList.get(0);
    } else {
        return this.colorList.get(1 + (nbIter-1) % (this.colorList.size()-1));
    }
}

PMandelbrot.prototype.resizeController = function() {
    this.controller.resize(
        Math.floor(this.canvas[0].width*$("#topDiv .sizeControlDiv .widthSliderDiv .slider").slider("value")/100),
        Math.floor(this.canvas[0].height*$("#topDiv .sizeControlDiv .heightSliderDiv .slider").slider("value")/100)
    );

    this.updateHidingBorders($("#topDiv .sizeControlDiv .widthSliderDiv .slider").slider("value"), $("#topDiv .sizeControlDiv .heightSliderDiv .slider").slider("value"));
}

PMandelbrot.prototype.convertPointForController = function(point) {
    return {
        x: point.x - Math.floor((this.canvas[0].width-this.controller.width)/2),
        y: point.y - Math.floor((this.canvas[0].height-this.controller.height)/2)
    };
}

PMandelbrot.prototype.updateHidingBorders = function(widthSliderValue, heightSliderValue) {
console.log(widthSliderValue+", "+heightSliderValue);
    var xDiff = (this.canvas[0].width-Math.floor(this.canvas[0].width*widthSliderValue/100))/2;
    var yDiff = (this.canvas[0].height-Math.floor(this.canvas[0].height*heightSliderValue/100))/2;
    $("#hidingBordersDiv .top").css("height", Math.floor(yDiff));
    $("#hidingBordersDiv .bottom").css("height", Math.ceil(yDiff));

    $("#hidingBordersDiv .left").css("width", Math.floor(xDiff));
    $("#hidingBordersDiv .right").css("width", Math.ceil(xDiff));
}