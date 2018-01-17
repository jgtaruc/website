(function(){
    // header animation
    var prevscrollY = 0,
    header = document.querySelector("#jg-header");

    window.addEventListener("scroll", function(evt){
        var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop,
            screenscroll = scrollY - prevscrollY,
            offsetY, headerHeight = header.clientHeight;

        if(screenscroll >= 0) {
            offsetY = -headerHeight; 
            if(offsetY < -headerHeight) {
                offsetY = -headerHeight;
            }
        } else {
            offsetY = 0;
        }

        if(scrollY !== 0) {
            header.style.backgroundColor = "#222";
        } else {
            header.style.backgroundColor = "transparent";
        }

        header.style.transform = "translateY(" + offsetY + "px)";

        prevscrollY = scrollY;
    });

    //sidebar js
    var sidebar_links = document.querySelectorAll(".sidebar-item");
    for(var i=0; i<sidebar_links.length; i++) {
        sidebar_links[i].addEventListener("click", function(evt){
            document.querySelector("#jg-sidebar-checkbox").checked = false;
        });
    }

    // mouse parallax
    var hero_bg = document.querySelector(".jg-hero-bg");
    if(hero_bg) {
        var el = hero_bg.querySelector(".jg-hero-img"),
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
            this.nextElementSibling.style.opacity = "1";
            this.parentNode.removeChild(this);
        });
    }

	function ScrollUp(el) {
		var scrollUpBtn = el,
			elHeight    = window.clientHeight,
			scrollPCT   = elHeight * 0.05,
			threshold   = elHeight * 0.3;

		window.addEventListener("scroll", ScrollCheck);
		window.addEventListener("resize", ScrollCheck);
		scrollUpBtn.addEventListener("click", ScrollToTop);

		if(el === document.body) {
			threshold = window.innerHeight;
		}

		function ScrollCheck() {
			y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
			if(y >= threshold) {
				return true;
			} else {
				return false;
			}
		}
		window["ScrollCheck"] = ScrollCheck;

		function ScrollToTop() {
			if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
				window.scrollBy(0, -(document.body.clientHeight*0.05));
				requestAnimationFrame(ScrollToTop);
			}
		}
    }
    
    ScrollUp(document.querySelector("#jg-scroll-up-btn"));
})();