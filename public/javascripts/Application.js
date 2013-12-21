function Application() {
    //this.mandelbrot = new Mandelbrot($(window).width()-200, $(window).height()-200);
    this.mandelbrot = new Mandelbrot(
        $(window).width()-200+15,
        $(window).height()-150
    );
}