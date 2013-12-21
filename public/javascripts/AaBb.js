function AaBb() {
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
}

AaBb.prototype.getMinX = function() {
    return this.minX;
}

AaBb.prototype.setMinX = function(minX) {
    this.minX = minX;
}

AaBb.prototype.getMaxX = function() {
    return this.maxX;
}

AaBb.prototype.setMaxX = function(maxX) {
    this.maxX = maxX;
}

AaBb.prototype.getMinY = function() {
    return this.minY;
}

AaBb.prototype.setMinY = function(minY) {
    this.minY = minY;
}

AaBb.prototype.getMaxY = function() {
    return this.maxY;
}

AaBb.prototype.setMaxY = function(maxY) {
    this.maxY = maxY;
}

AaBb.prototype.setWidth = function(width) {
    this.maxX = this.minX+width;
}

AaBb.prototype.setHeight = function(height) {
    this.maxY = this.minY+height;
}

AaBb.prototype.getWidth = function() {
    return this.maxX-this.minX;
}

AaBb.prototype.getHeight = function() {
    return this.maxY-this.minY;
}

AaBb.prototype.move = function(dx, dy) {
    this.minX += dx;
    this.minY += dy;
    this.maxX += dx;
    this.maxY += dy;
}

AaBb.prototype.centerOn = function(x, y) {
    this.move(x-this.getWidth()/2-this.minX, y-this.getHeight()/2-this.minY);
}

AaBb.prototype.intersection = function(aabb) {
    var intersection = new AaBb();
    intersection.minX = Math.max(this.minX, aabb.minX);
    intersection.minY = Math.max(this.minY, aabb.minY);
    intersection.maxX = Math.min(this.maxX, aabb.maxX);
    intersection.maxY = Math.min(this.maxY, aabb.maxY);
    return intersection;
}