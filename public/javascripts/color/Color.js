function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

Color.prototype.clone = function() {
    return new Color(this.r, this.g, this.b);
}

Color.prototype.htmlNotation = function() {
    return "#"+Color.toHexaString(this.r)+Color.toHexaString(this.g)+Color.toHexaString(this.b);
}

Color.toHexaString = function(n) {
    var d1 = Math.floor(n/16);
    var d2 = n-d1*16;
    return Color.getHexaDigit(d1)+Color.getHexaDigit(d2);
}

Color.getHexaDigit = function(d) {
    if(d < 10) {
        return ""+d;
    } else {
        switch(d) {
            case 10:
                return "A";
            case 11:
                return "B";
            case 12:
                return "C";
            case 13:
                return "D";
            case 14:
                return "E";
            case 15:
                return "F";
        }
    }
}

Color.prototype.set = function(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
}


Color.BLACK = new Color(0, 0, 0);
Color.WHITE = new Color(255, 255, 255);
Color.RED = new Color(255, 0, 0);
Color.GREEN = new Color(0, 255, 0);
Color.BLUE = new Color(0, 0, 255);
Color.YELLOW = new Color(255, 255, 0);
Color.MAGENTA = new Color(255, 0, 255);
Color.CYAN = new Color(0, 255, 255);