function ImageCoordinate(x, y, zoom, maxIter, escapeRadius) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
    this.maxIter = maxIter;
    this.escapeRadius = escapeRadius;
}

ImageCoordinate.defaultCoordinate = function() {
    return new ImageCoordinate(
        0,
        0,
        250,
        20,
        2
    );
}