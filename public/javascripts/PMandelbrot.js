function PMandelbrot(controller) {
    this.controller = controller;
    this.colorList = ColorList.PRESET2.clone();

    this.colorPanel = new ColorPanel(this.colorList);

    this.canvas = $("#canvas");
    this.choseCanvasContext();

    this.controller.setGl(this.isGlContext ? this.context : null);

    this.updateSize();

    this.registerEvents();
}

PMandelbrot.prototype.repaint = function() {
    this.paint2d();
}

PMandelbrot.prototype.paint2d = function() {
    var colorStep = 255 / this.controller.imageCoordinate.maxIter;
    var px = 0;
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
    }

    this.context.putImageData(this.imageData, 0, 0);
}

PMandelbrot.prototype.choseCanvasContext = function() {
    try {
        this.context = this.canvas[0].getContext("experimental-webgl");
        this.context.viewportWidth = canvas.width;
        this.context.viewportHeight = canvas.height;
        this.isGlContext = true;
    } catch(e) {
        console.log("Could not initialise WebGL, switching to 2d context");
        this.context = canvas.getContext("2d");
        this.isGlContext = false;
    }
}

PMandelbrot.prototype.getPoint = function(e) {
    return {x : e.pageX-this.canvas[0].offsetLeft, y : e.pageY-this.canvas[0].offsetTop};
}

PMandelbrot.prototype.registerEvents = function() {
    this.viewMoved = false;
    this.pressedPoint = null;

    var pMandelbrot = this;

    this.canvas.mousedown(function(e) {
        pMandelbrot.pressedPoint = pMandelbrot.getPoint(e);
        pMandelbrot.pressedMouseButton = e.button;
    });

    this.canvas.mouseup(function(e) {
        var point = pMandelbrot.getPoint(e);
        if(pMandelbrot.viewMoved && pMandelbrot.pressedPoint.x != point.x || pMandelbrot.pressedPoint.y != point.y) {
            pMandelbrot.controller.moveAaBb(pMandelbrot.pressedPoint.x - point.x, pMandelbrot.pressedPoint.y - point.y);
        }
        pMandelbrot.pressedPoint = null;
        pMandelbrot.viewMoved = false;
        pMandelbrot.pressedMouseButton = null;
    });

    this.canvas.mousemove(function(e) {
        var point = pMandelbrot.getPoint(e);
        if(pMandelbrot.pressedMouseButton == 0) {
            pMandelbrot.viewMoved = true;
            pMandelbrot.movingView(point.x-pMandelbrot.pressedPoint.x, point.y-pMandelbrot.pressedPoint.y);
        } else {
            pMandelbrot.pressedPoint = point;
        }
    });

    this.canvas.on("wheel", function(e) {
        console.log("wheeeel");
        if(pMandelbrot.pressedMouseButton == null) {
            pMandelbrot.controller.zoom(e.deltaY < 0, pMandelbrot.pressedPoint);
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
        pMandelbrot.controller.resize($(window).width()-200, $(window).height()-150);
    });

    $("#topDiv .sizeControlDiv .slider").each(function() {
        $(this).slider({
            value: 100,
            range: "min"
        });
    });

    this.keepProportion = true;
    $("#topDiv .sizeControlDiv .keepProportionButtonDiv").click(function() {
        pMandelbrot.toggleKeepProportion();
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
    this.canvas[0].width = this.controller.width;
    this.canvas[0].height = this.controller.height;
    $("#topDiv").width($(window).width()-200);
    $("#rightDiv .colorListPanelDiv").height($(window).height()-150);

    if(this.isGlContext) {

    } else {
        this.imageData = this.context.createImageData(this.controller.width, this.controller.height);
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

PMandelbrot.prototype.toggleKeepProportion = function() {
    this.keepProportion = !this.keepProportion;
    $("#topDiv .sizeControlDiv .keepProportionButtonDiv").css("background-image", 'url("images/'+(this.keepProportion ? 'keepProportion' : 'dontKeepProportion')+'.png")');
}