function ColorList() {
    this.firstColor = Color.BLACK.clone();
    this.colors = new Array();
    this.size = 1;
}

ColorList.prototype.getGradient = function(n) {
    return this.colors[n];
}

ColorList.prototype.getGradientCount = function() {
    return this.colors.length;
}

ColorList.prototype.setGradient = function(gradientIndex, firstColor, length) {
    this.size += length-this.colors[gradientIndex].length;
    this.colors[gradientIndex] = new Array();
    var gradient = this.colors[gradientIndex];

    for(var i=0; i<length; i++) {
        gradient[i] = new Color(0, 0, 0);
    }

    gradient[0] = firstColor.clone();
    var lastColor = this.colors[this.getNextIndex(gradientIndex)][0];
    for(var i=1; i<gradient.length; i++) {
        gradient[i].r = Math.floor(firstColor.r + i*(lastColor.r-firstColor.r)/length);
        gradient[i].g = Math.floor(firstColor.g + i*(lastColor.g-firstColor.g)/length);
        gradient[i].b = Math.floor(firstColor.b + i*(lastColor.b-firstColor.b)/length);
    }
}

ColorList.prototype.getNextIndex = function(index) {
    return (index+1)%this.colors.length;
}

ColorList.prototype.getPreviousIndex = function(index) {
    if(index == 0) {
        return this.colors.length-1;
    } else {
        return index-1;
    }
}

ColorList.prototype.addGradient = function(index, color, length) {
    var newColors = new Array();
    for(var i=0; i<index; i++) {
        newColors[i] = this.colors[i];
    }
    newColors[index] = new Array();
    for(var i=index; i<this.colors.length; i++) {
        newColors[i+1] = this.colors[i];
    }
    this.colors = newColors;

    this.setGradient(index, color, length);
    var previousIndex = this.getPreviousIndex(index);
    if(previousIndex != index) {
        this.updateGradient(previousIndex);
    }
}

ColorList.prototype.updateGradient = function(index) {
    this.setGradient(index, this.colors[index][0], this.colors[index].length);
}

ColorList.prototype.getSize = function() {
    return this.size;
}

ColorList.prototype.get = function(n) {
    if(n == 0) {
        return this.firstColor;
    } else {
        n--;
        var i=0;
        while(n >= this.colors[i].length) {
            n -= this.colors[i].length;
            i++;
        }
        return this.colors[i][n];
    }
}

ColorList.prototype.setFirstColor = function(color) {
    this.firstColor = color.clone();
}

ColorList.prototype.getFirstColor = function() {
    return this.firstColor;
}

ColorList.prototype.setGradientFirstColor = function(color, gradientIndex) {
    this.colors[gradientIndex] = color;
}

ColorList.prototype.clone = function() {
    var colorList = new ColorList();
    for(var i=0; i<this.colors.length; i++) {
        colorList.colors[i] = new Array();
        for(var j=0; j<this.colors[i].length; j++) {
            colorList.colors[i][j] = this.colors[i][j].clone();
        }
    }
    colorList.firstColor = this.firstColor;
    colorList.size = this.size;
    return colorList;
}

ColorList.prototype.updateGradients = function(index) {
    this.updateGradient(index);
    var previousIndex = this.getPreviousIndex(index);
    if(previousIndex != index) {
        this.updateGradient(previousIndex);
    }
}

ColorList.prototype.deleteGradient = function(index) {
    this.size -= this.colors[index].length;

    var gradients = new Array();
    for(var i=0; i<index; i++) {
        gradients[i] = this.colors[i];
    }
    for(var i=(index+1); i<this.colors.length; i++) {
        gradients[i-1] = this.colors[i];
    }
    this.colors = gradients;

    this.updateGradient(this.getPreviousIndex(index));
}





/*
ColorList.PRESET1 = new ColorList();
ColorList.PRESET1.addColor(Color.BLACK);
ColorList.PRESET1.addGradient(Color.GREEN, Color.CYAN, 10);
ColorList.PRESET1.addGradient(Color.CYAN, Color.BLUE, 10);
ColorList.PRESET1.addGradient(Color.BLUE, Color.MAGENTA, 10);
ColorList.PRESET1.addGradient(Color.MAGENTA, Color.RED, 10);
ColorList.PRESET1.addGradient(Color.RED, Color.YELLOW, 10);
ColorList.PRESET1.addGradient(Color.YELLOW, Color.GREEN, 10);
*/

ColorList.PRESET2 = new ColorList();
ColorList.PRESET2.setFirstColor(Color.BLACK);
ColorList.PRESET2.addGradient(0, new Color(0, 96, 32), 3);
ColorList.PRESET2.addGradient(1, new Color(128, 0, 0), 3);
ColorList.PRESET2.addGradient(2, new Color(64, 0, 64), 3);
/*ColorList.PRESET2.addGradient(new Color(0, 96, 32), new Color(128, 0, 0), 30);
ColorList.PRESET2.addGradient(new Color(128, 0, 0), new Color(64, 0, 64), 30);
ColorList.PRESET2.addGradient(new Color(64, 0, 64), new Color(0, 96, 32), 30);
*/