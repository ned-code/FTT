(function(w){
    w.$fform = {};
    var module = w.$fform,
        functions = {
            stringBuffer:function(){
                return (function(){
                    var b = "";
                    this.length = 0;
                    return {
                        _:function(s){
                            if(arguments.length>1){
                                var tmp="", l=arguments.length;
                                switch(l){
                                    case 9: tmp=""+arguments[8]+tmp;
                                    case 8: tmp=""+arguments[7]+tmp;
                                    case 7: tmp=""+arguments[6]+tmp;
                                    case 6: tmp=""+arguments[5]+tmp;
                                    case 5: tmp=""+arguments[4]+tmp;
                                    case 4: tmp=""+arguments[3]+tmp;
                                    case 3: tmp=""+arguments[2]+tmp;
                                    case 2: {
                                        b+=""+arguments[0]+arguments[1]+tmp;
                                        break;
                                    }
                                    default: {
                                        var i=0;
                                        while(i<arguments.length){
                                            tmp += arguments[i++];
                                        }
                                        b += tmp;
                                    }
                                }
                            } else {
                                b += s;
                            }
                            this.length = b.length;
                            return this;
                        },
                        clear:function(){
                            b = "";
                            this.length = 0;
                            return this;
                        },
                        result:function(){
                            return b;
                        }
                    }
                }).call(this)
            },
            parse:function(args){
            },
            load:function(args){

            }
        },
        sb = functions.stringBuffer();
})(window)

