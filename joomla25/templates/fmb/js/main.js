(function(){
    var init = function(){
        if("undefined" === typeof(window.FB)){
            setTimeout(init, 250);
        } else {
            FB.Canvas.setSize();
        }
    }
    init();
})();

(function(){
    var init = function(){
        if($FamilyTreeTop.fn.mod("render")){
            $FamilyTreeTop.fn.mod("render").init();
        } else {
            setTimeout(init, 250);
        }
    }
    init();
})();

