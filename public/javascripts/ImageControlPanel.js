function ImageControlPanel(pMandelbrot) {
    this.pMandelbrot = pMandelbrot;

    this.widthSlider = $("#topDiv .sizeControlDiv .widthSliderDiv .slider");
    this.heightSlider = $("#topDiv .sizeControlDiv .heightSliderDiv .slider");

    this.keepProportion = true;

    this.registerEvents();
}

ImageControlPanel.prototype.registerEvents = function() {
    var imageControl = this;

    $("#topDiv .sizeControlDiv .slider").each(function() {
        $(this).slider({
            value: 100,
            min: 5,
            range: "min",
            change: function(event, ui) {
                if(event.originalEvent) {
                    imageControl.sliderValueChanged(ui.value, this);
                    imageControl.pMandelbrot.resizeController();
                }
            },
            slide: function(event, ui) {
                imageControl.sliderSlided(ui.value, this);
                imageControl.pMandelbrot.updateHidingBorders(
                    (imageControl.keepProportion || imageControl.widthSlider == this ? ui.value : imageControl.widthSlider.slider("value")),
                    (imageControl.keepProportion || imageControl.heightSlider == this ? ui.value : imageControl.heightSlider.slider("value"))
                );
            }
        });
    });

    $("#topDiv .sizeControlDiv .keepProportionButtonDiv").click(function() {
        imageControl.toggleKeepProportion();
    });
}

ImageControlPanel.prototype.sliderValueChanged = function(value, slider) {
    this.updateOtherSliderValue(value, slider);
}

ImageControlPanel.prototype.updateOtherSliderValue = function(value, slider) {
    if(this.keepProportion) {
        var sliderToMove = (slider == this.widthSlider[0] ? this.heightSlider : this.widthSlider);
        sliderToMove.slider("value", value);
    }
}

ImageControlPanel.prototype.sliderSlided = function(value, slider) {
    this.updateOtherSliderValue(value, slider);
}

ImageControlPanel.prototype.toggleKeepProportion = function() {
    this.keepProportion = !this.keepProportion;
    $("#topDiv .sizeControlDiv .keepProportionButtonDiv").css("background-image", 'url("images/'+(this.keepProportion ? 'keepProportion' : 'dontKeepProportion')+'.png")');
}
