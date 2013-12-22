function AnyPowAlgorithm() {
    this.delta = 4;
    this.pow = 2.07;
}

AnyPowAlgorithm.prototype.process = function(width, height, aabb, imageCoordinate, data) {
    var step = aabb.getWidth() / width;

    for(var i=0; i<width; i++) {
        for(var j=0; j<height; j++) {
            var x = i*step + aabb.minX;
            var y = j*step + aabb.minY;

            var rho;
            var theta;
            var factor;
            var angle;

            var ur = 0;
            var ui = 0;

            var nbIter = 0;
            while(ur*ur+ui*ui < this.delta && nbIter < imageCoordinate.maxIter) {
                //Calcul des coordonnées polaires à partir des coordonnées cartésiennes
                rho = Math.sqrt(ur*ur+ui*ui);
                theta = (rho == 0 ? 0 : Math.acos(ur/rho));
                if(ui < 0) {
                    theta = -theta;
                }

                factor = Math.pow(rho, this.pow);
                angle = this.pow*theta;
                ur = factor * Math.cos(angle) + x;
                ui = factor * Math.sin(angle) + y;

                /*// Autre solution, apparemment (source : wikipedia, Multibrot set)
                xtmp=(x*x+y*y)^(n/2)*cos(n*atan2(y,x)) + a
                y=(x*x+y*y)^(n/2)*sin(n*atan2(y,x)) + b
                x=xtmp
                */


                nbIter++;
            }

            data[i][j] = nbIter;
        }
    }
}