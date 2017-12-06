(function(){
    // header animation
    var prevscrollY = 0,
    header = document.querySelector("#jg-header");

    window.addEventListener("scroll", function(evt){
        var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop,
            screenscroll = scrollY - prevscrollY,
            offsetY;

        if(screenscroll >= 0) {
            offsetY = -55; 
            if(offsetY < -55) {
                offsetY = -55;
            }
        } else {
            offsetY = 0;
        }

        if(scrollY !== 0) {
            header.style.backgroundColor = "#1d1d1d";
        } else {
            header.style.backgroundColor = "transparent";
        }

        header.style.transform = "translateY(" + offsetY + "px)";

        prevscrollY = scrollY;
    });

    // mouse parallax
    var hero_bg = document.querySelector(".jg-hero-bg"),
    el = hero_bg.querySelector(".jg-hero-img"),
    prevEvt;

    document.querySelector(".jg-hero-bg").addEventListener("mousemove", function(evt){
        if(typeof prevEvt === "undefined") {
            prevEvt = evt;
            return;
        }

        var movementX = evt.screenX - prevEvt.screenX,
            movementY = evt.screenY - prevEvt.screenY,
            x = y = 0;

        if(movementX < 0) { x = "20px" }
        else if(movementX > 0) { x = "-20px" }

        if(movementY < 0) { y = "20px" }
        else if(movementY > 0) { y = "-20px" }

        el.style.transform = "translate(" + x + "," + y  + ")";
        prevEvt = evt;
    });

    document.querySelector(".jg-hero-bg").addEventListener("mouseleave", function(evt){
        el.style.transform = "translate(0, 0)";
    })

    // main box
    var img = hero_bg.querySelector("img"),
    hero_bg_main = hero_bg.querySelector(".jg-cta");
    img.setAttribute("src", "assets/hero-img.jpg");
    img.addEventListener("load", function(){
        this.parentNode.style.opacity = "1";
        this.parentNode.removeChild(this);
    });
})();