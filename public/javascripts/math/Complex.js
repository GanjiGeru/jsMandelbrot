function Complex(x, y) {
    this.x = x;
    this.y = y;
}

Complex.prototype.mod = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
}

Complex.prototype.arg = function(mod) {
    if(mod == null) {
        mod = this.mod();
    }

    var t = Math.acos(this.x / mod);
    if(this.y < 0) {
        t = -t;
    }
    return t;
}

Complex.prototype.ln = function() {
    var r = this.mod();
    var t = this.arg(r);

    var z = new Complex(Math.log(r), t);
    /*var x = Math.cos(z.y) * z.x;
    var y = Math.sin(z.y) * z.x;
    z.x = x;
    z.y = y;*/
    return z;
}

Complex.prototype.arctanh = function() {
    var z1 = new Complex(1+this.x, this.y).ln();
    var z2 = new Complex(1-this.x, -this.y).ln();
    return new Complex((z1.x - z2.x)/2, (z1.y - z2.y)/2);
}

Complex.prototype.mul = function(z) {
    return new Complex(this.x*z.x - this.y*z.y, this.x*z.y + this.y*z.x);
}

Complex.prototype.add = function(z) {
    this.x += z.x;
    this.y += z.y;
}
