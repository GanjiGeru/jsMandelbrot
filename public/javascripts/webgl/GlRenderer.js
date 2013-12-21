function GlRenderer(gl) {
    this.gl = gl;

    this.shaderProgram = null;
    this.aVertexPosition = null;
    this.vertexPositionBuffer = null;
}

GlRenderer.prototype.initShaders = function() {
    var fragmentShader = GlUtil.getShader(this.gl, "shader-fs");
    var vertexShader = GlUtil.getShader(this.gl, "shader-vs");

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    if(!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    this.gl.useProgram(this.shaderProgram);

    this.aVertexPosition = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.aVertexPosition);

    this.aPlotPosition = this.gl.getAttribLocation(this.shaderProgram, "aPlotPosition");
    this.gl.enableVertexAttribArray(this.aPlotPosition);
}

GlRenderer.prototype.initBuffers = function() {
    this.vertexPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    var vertices = [
        1.0,  1.0,
        -1.0,  1.0,
        1.0, -1.0,
        -1.0, -1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 2;
    this.vertexPositionBuffer.numItems = 4;
}

GlRenderer.prototype.setCorners = function(aabb) {
    this.corners = [
        aabb.maxX, aabb.maxY,
        aabb.minX, aabb.maxY,
        aabb.maxX, aabb.minY,
        aabb.minX, aabb.minY
    ];
}

GlRenderer.prototype.drawScene = function(aabb) {

    var maxIterLocation = this.gl.getUniformLocation(this.shaderProgram, "maxIter");
    this.gl.uniform1i(maxIterLocation, 20);


    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    this.gl.vertexAttribPointer(this.aVertexPosition, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    var plotPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, plotPositionBuffer);
    this.setCorners(aabb);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.corners), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.aPlotPosition, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.gl.deleteBuffer(plotPositionBuffer)
}
