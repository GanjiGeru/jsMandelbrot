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
                /*var tmp = ur*ur - ui*ui + x;
                var ui = 2*ur*ui + y;
                var ur = tmp;*/

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

                /*ur = rho*rho * Math.cos(2*theta) + x;
                ui = rho*rho * Math.sin(2*theta) + y;*/

                nbIter++;
            }

            data[i][j] = nbIter;
        }
    }
}