function ColorList() {
    this.colors = new Array();
}

ColorList.prototype.addGradient = function(origColor, destColor, colorCount, index) {
    if(index == null) {
        index = this.colors.length;
    }

    var newColors = new Array();
    for(var i=0; i<index; i++) {
        newColors[i] = this.colors[i];
    }

    for(var i=0; i<colorCount; i++) {
        newColors.push(new Color(
            Math.floor(origColor.r + i*(destColor.r-origColor.r)/colorCount),
            Math.floor(origColor.g + i*(destColor.g-origColor.g)/colorCount),
            Math.floor(origColor.b + i*(destColor.b-origColor.b)/colorCount)
        ));
    }

    for(var i=index; i<this.colors.length; i++) {
        newColors.push(this.colors[i]);
    }

    this.colors = newColors;
}

ColorList.prototype.addColor = function(color, index) {
    this.addGradient(color, color, 1, index);
}

ColorList.prototype.size = function() {
    return this.colors.length;
}

ColorList.prototype.get = function(i) {
    return this.colors[i];
}

ColorList.prototype.setColor = function(color, index) {
    this.colors[index] = color;
}

ColorList.prototype.clone = function() {
    var colorList = new ColorList();
    for(var i=0; i<this.colors.length; i++) {
        colorList.colors[i] = this.colors[i].clone();
    }
    return colorList;
}










ColorList.PRESET1 = new ColorList();
ColorList.PRESET1.addColor(Color.BLACK);
ColorList.PRESET1.addGradient(Color.GREEN, Color.CYAN, 10);
ColorList.PRESET1.addGradient(Color.CYAN, Color.BLUE, 10);
ColorList.PRESET1.addGradient(Color.BLUE, Color.MAGENTA, 10);
ColorList.PRESET1.addGradient(Color.MAGENTA, Color.RED, 10);
ColorList.PRESET1.addGradient(Color.RED, Color.YELLOW, 10);
ColorList.PRESET1.addGradient(Color.YELLOW, Color.GREEN, 10);


ColorList.PRESET2 = new ColorList();
ColorList.PRESET2.addColor(Color.WHITE);
ColorList.PRESET2.addGradient(new Color(0, 96, 32), new Color(128, 0, 0), 30);
ColorList.PRESET2.addGradient(new Color(128, 0, 0), new Color(64, 0, 64), 30);
ColorList.PRESET2.addGradient(new Color(64, 0, 64), new Color(0, 96, 32), 30);
