(function(){
    var init = function(){
        if("undefined" === typeof(window.FB)){
            setTimeout(init, 1000);
        } else {
            FB.Canvas.setSize();
        }
    }
    init();
})()
