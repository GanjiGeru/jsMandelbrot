function ArctanhAlgorithm() {
    this.delta = 100;
    this.pow = 2.07;
}

ArctanhAlgorithm.prototype.process = function(width, height, aabb, imageCoordinate, data) {
    var step = aabb.getWidth() / width;

    for(var i=0; i<width; i++) {
        for(var j=0; j<height; j++) {
            /*var x = i*step + aabb.minX;
            var y = j*step + aabb.minY;

            var r1, r2, t1, t2;

            var ur = 0;
            var ui = 0;

            var nbIter = 0;
            while(ur*ur+ui*ui < this.delta && nbIter < imageCoordinate.maxIter) {

                r1 = this.mod(1+ur, ui);
                r2 = this.mod(1-ur, -ui);
                t1 = this.arg(1+ur, ui, r1);
                t2 = this.arg(1-ur, -ui, r2);

                //arctanh(ur + i.ui) = (ln(r1) - ln(r2)) /2 + i*(t1-t2)/2

                ur = (Math.log(r1) - Math.log(r2)) / 2 + x;
                ui = (t1-t2)/2 + y;

                nbIter++;
            }*/

            var z = new Complex(i*step + aabb.minX, j*step + aabb.minY);
            var nbIter = 0;

            var u = new Complex(0, 0);

            while(u.x*u.x+u.y*u.y < this.delta && nbIter < imageCoordinate.maxIter) {

                u = u.arctanh().mul(u);
                u.x *= 0.9;
                u.y *= 0.9;
                u.add(z);

                nbIter++;
            }

            data[i][j] = nbIter;
        }
    }
}

ArctanhAlgorithm.prototype.mod = function(x, y) {
    return Math.sqrt(x*x + y*y);
}

ArctanhAlgorithm.prototype.arg = function(x, y, mod) {
    var t = Math.acos(x/mod);
    if(y < 0) {
        t = -t;
    }
    return t;
}