function BasicAlgorithm() {
    this.delta = 4;
}

BasicAlgorithm.prototype.process = function(width, height, aabb, imageCoordinate, data) {
    var step = aabb.getWidth() / width;

    for(var i=0; i<width; i++) {
        for(var j=0; j<height; j++) {
            var x = i*step + aabb.minX;
            var y = j*step + aabb.minY;

            var ur = 0;
            var ui = 0;

            var nbIter = 0;
            while(ur*ur+ui*ui < this.delta && nbIter < imageCoordinate.maxIter) {
                var tmp = ur*ur - ui*ui + x;
                var ui = 2*ur*ui + y;
                var ur = tmp;
                nbIter++;
            }

            data[i][j] = nbIter;
        }
    }
}