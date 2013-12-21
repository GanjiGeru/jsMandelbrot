function ColorPanel(colorList) {
    this.colorList = colorList;
    this.init();
}

ColorPanel.prototype.init = function() {
    var html = "<ul>";

    for(var i=0; i<this.colorList.size(); i++) {
        var color = this.colorList.get(i);
        html += '<li style="background-color: '+color.htmlNotation()+'"><div class="liDiv"><div class="checkboxDiv"><input type="checkbox" value="'+i+'" /></div><div class="textDiv">'+i+'</div><div></li>';
    }

    html += "</ul>"

    $("#rightDiv .colorListPanelDiv").html(html);
}

