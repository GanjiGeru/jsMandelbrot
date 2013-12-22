function ColorPanel(colorList, pMandelbrot) {
    this.colorList = colorList;
    this.pMandelbrot = pMandelbrot;
    this.init();
}

ColorPanel.prototype.init = function() {
    var colorPanel = this;

    //FUNCTIONS ////
    this.gradientColorCountSpinnerFunction = function() {
        $(this).spinner({
            min: 1,
            max: 256,
            change: function() {
                colorPanel.gradientColorCountSpinnerValueChanged($(this).attr("gradientIndex"), null);
            },
            spin: function(event, ui) {
                colorPanel.gradientColorCountSpinnerValueChanged($(this).attr("gradientIndex"), ui.value);
            }
        });
    };
    this.deleteButtonClickFunction = function() {
        if(colorPanel.colorList.getGradientCount() > 1) {
            var index = parseInt($(this).attr("gradientIndex"));
            $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(index+1)+")").remove();
            colorPanel.colorList.deleteGradient(index);
            colorPanel.pMandelbrot.repaint();

            for(var i=index; i<colorPanel.colorList.getGradientCount(); i++) {
                $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .deleteButton").attr("gradientIndex", i);
                $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .cloneButton").attr("gradientIndex", i);
                $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .spinnerDiv input").attr("gradientIndex", i);
                $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .colorDiv").attr("index", i+1);
            }
        } else {
            alert("At least one gradient must remain in the list.");
        }
    }
    this.cloneButtonClickFunction = function() {
        var index = parseInt($(this).attr("gradientIndex"));

        colorPanel.colorList.addGradient(index+1, colorPanel.colorList.getGradient(index)[0], colorPanel.colorList.getGradient(index).length);

        //Add list item
        $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(index+1)+")").after(colorPanel.getColorListItemDivHtml(index+1));
        $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(index+2)+") .colorCountDiv input").each(colorPanel.gradientColorCountSpinnerFunction);
        $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(index+2)+") .buttonsDiv .deleteButton").click(colorPanel.deleteButtonClickFunction);
        $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(index+2)+") .buttonsDiv .cloneButton").click(colorPanel.cloneButtonClickFunction);
        $("#rightDiv .colorListItemDiv:nth-child("+(index+2)+") .colorDiv").each(colorPanel.colorDivEachFunction);
        $("#rightDiv .colorListItemDiv:nth-child("+(index+2)+") .colorDiv").click(colorPanel.colorDivClickFunction);

        //Update indices
        for(var i=index+2; i<colorPanel.colorList.getGradientCount(); i++) {
           $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .deleteButton").attr("gradientIndex", i);
           $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .cloneButton").attr("gradientIndex", i);
           $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .spinnerDiv input").attr("gradientIndex", i);
           $("#rightDiv .colorListDiv .colorListItemDiv:nth-child("+(i+1)+") .colorDiv").attr("index", i+1);
        }

        colorPanel.pMandelbrot.repaint();
    }
    this.colorDivEachFunction = function() {
        var index = $(this).attr("index");
        var color = (index == 0 ? colorPanel.colorList.getFirstColor() : colorPanel.colorList.getGradient(index-1)[0]);
        $(this).css("background-color", color.htmlNotation());
    }
    this.colorDivClickFunction = function() {
        colorPanel.openColorPickerDialog($(this).attr("index"));
    }
    ////////////////

    var html = "";
    for(var i=0; i<this.colorList.getGradientCount(); i++) {
        html += this.getColorListItemDivHtml(i);
    }

    $("#rightDiv .colorListDiv").html(html);

    $("#rightDiv .colorListDiv .colorCountDiv input").each(this.gradientColorCountSpinnerFunction);

    $("#rightDiv .colorListDiv .buttonsDiv .deleteButton").click(this.deleteButtonClickFunction);

    $("#rightDiv .colorListDiv .buttonsDiv .cloneButton").click(this.cloneButtonClickFunction);

    $("#rightDiv .colorDiv").each(this.colorDivEachFunction);

    $("#rightDiv .colorDiv").click(this.colorDivClickFunction);

    this.initColorPickerDialog();
}

ColorPanel.prototype.getColorListItemDivHtml = function(i) {
    var gradient = this.colorList.getGradient(i);
    return '<div class="colorListItemDiv">'+
        '<div class="colorDiv" index="'+(i+1)+'"></div>'+
        '<div class="colorCountDiv">'+
            '<div class="spinnerDiv">'+
                '<input type="text" gradientIndex="'+i+'" value="'+gradient.length+'"/>'+
            '</div>'+
            '<div class="gradientDiv"></div>'+
        '</div>'+
        '<div class="buttonsDiv">'+
            '<div class="deleteButton" gradientIndex="'+i+'"></div>'+
            '<div class="cloneButton" gradientIndex="'+i+'"></div>'+
        '</div>'+
    '</div>';
}

ColorPanel.prototype.openColorPickerDialog = function(index) {
    var colorPanel = this;

    this.selectedIndex = index;
    if(index == 0) {
        this.selectedColor = this.colorList.getFirstColor();
    } else {
        this.selectedColor = this.colorList.getGradient(index-1)[0];
    }

    $(".colorPickerDialog").dialog({
        modal: true,
        width: 500,
        buttons: {
            "OK": function() {
                colorPanel.validatePickedColor();
                $(this).dialog("close");
            },
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });

    $(".colorPickerDialog .redDiv").slider("value", this.selectedColor.r);
    $(".colorPickerDialog .greenDiv").slider("value", this.selectedColor.g);
    $(".colorPickerDialog .blueDiv").slider("value", this.selectedColor.b);
}

ColorPanel.prototype.initColorPickerDialog = function() {
    var colorPanel = this;

    $(".colorPickerDialog .redDiv, .colorPickerDialog .greenDiv, .colorPickerDialog .blueDiv").slider({
        orientation: "horizontal",
        range: "min",
        max: 255,
        value: 127,
        slide: function() { colorPanel.refreshSwatch(); },
        change: function() { colorPanel.refreshSwatch(); }
    });
}

ColorPanel.prototype.refreshSwatch = function() {
    $(".colorPickerDialog .swatchDiv").css("background-color", this.getPickedColor().htmlNotation());
}

ColorPanel.prototype.getPickedColor = function() {
    var red = $(".colorPickerDialog .redDiv").slider("value");
    var green = $(".colorPickerDialog .greenDiv").slider("value");
    var blue = $(".colorPickerDialog .blueDiv").slider("value");
    return new Color(red, green, blue);
}

ColorPanel.prototype.validatePickedColor = function() {
    this.selectedColor.set(this.getPickedColor());
    $("#rightDiv .colorDiv[index="+this.selectedIndex+"]").css("background-color", this.selectedColor.htmlNotation());

    if(this.selectedIndex != 0) {
        this.colorList.updateGradients(this.selectedIndex-1);
    }
    this.pMandelbrot.repaint();
}

ColorPanel.prototype.gradientColorCountSpinnerValueChanged = function(gradientIndex, value) {
    if(value == null) {
        value = $("#rightDiv .colorListDiv .colorCountDiv input[gradientIndex="+gradientIndex+"]").spinner("value");
    }
    this.colorList.setGradient(gradientIndex, this.colorList.getGradient(gradientIndex)[0], value);
    this.pMandelbrot.repaint();
}