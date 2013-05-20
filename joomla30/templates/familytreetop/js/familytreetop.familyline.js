$FamilyTreeTop.create("familyline", function($){
    'use strict';
    var $this = this,
        $box,
        $pull = [],
        $fn;

    $fn = {
        renderChart: function(canvas, ctx, index, data){
            var lastend = Math.PI * 1.5,
                myTotal = 0,
                myColor = ['#c2c3c2','#22b14c','#c2c3c2'],
                e,
                i;

            for( e = 0; e < data.length; e++){
                myTotal += data[e];
            }

            for (i = 0; i < data.length; i++){
                ctx.fillStyle = index ? myColor[i] : myColor[i+1];
                ctx.beginPath();
                ctx.moveTo(canvas.width/2,canvas.height/2);
                ctx.arc(canvas.width/2,canvas.height/2,canvas.height/2,lastend,lastend+(Math.PI*2*(data[i]/myTotal)),false);
                ctx.lineTo(canvas.width/2,canvas.height/2);
                ctx.fill();
                lastend += Math.PI*2*(data[i]/myTotal);
            }
        },
        renderCharts:function(index, el){
            var canvas = this,
                ctx = canvas.getContext("2d");
            $fn.renderChart(canvas, ctx, index, [485, 343]);
        },
        buttonClick:function(){
            var $this = this, icon = $($this).find('i'), _class = $(icon).attr('class').split(" ")[0], args, line;
            line = ($(icon).attr('familytreetop-line') == "father")?1:0;
            switch(_class){
                case "icon-pencil":
                    if($(icon).hasClass('icon-pencil-active')){
                        $(icon).removeClass('icon-pencil-active');
                        $($this).removeClass('btn-warning');
                        args = {type:"pencil", active: 0, line: line};
                    } else {
                        $(icon).addClass('icon-pencil-active');
                        $($this).addClass('btn-warning');
                        args = {type:"pencil", active: 1, line: line};
                    }
                    break;

                case "icon-eye-open":
                    $(icon).removeClass('icon-eye-open');
                    $($this).addClass('btn-warning');
                    $(icon).addClass('icon-eye-close');
                    args = {type:"eye", active: 0, line: line};
                    break;

                case "icon-eye-close":
                    $(icon).removeClass('icon-eye-close');
                    $($this).removeClass('btn-warning');
                    $(icon).addClass('icon-eye-open');
                    args = {type:"eye", active: 1, line: line};
                    break;

                default:
                    break;

            }
            $fn.send(args);
        },
        buttonsClick:function(index, el){
            $(el).click($fn.buttonClick);
        },
        eye: function(item, args){
            var func = (args.line)?"isFatherLine":"isMotherLine",
                active = (args.active)?"show":"hide",
                el = item.target,
                user = $this.mod('usertree').user(item.gedcom_id);

            if(user[func]()){
                $(el)[active]();
            }
        },
        pencil: function(item, args){
            var func = (args.line)?"isFatherLine":"isMotherLine",
                user = $this.mod('usertree').user(item.gedcom_id),
                el = item.target;

            if(user[func]()){
                if(args.active){
                    $(el).addClass('badge');
                    $(el).addClass('badge-warning');
                    $(el).addClass('familytreetop-text-black');
                } else {
                    $(el).removeClass('badge');
                    $(el).removeClass('badge-warning');
                    $(el).removeClass('familytreetop-text-black');
                }
            }
        },
        send: function(args){
            for(var prop in $pull){
                if(!$pull.hasOwnProperty(prop)) continue;
                $fn[args.type]($pull[prop], args);
            }
        }
    }

    $this.init = function(){
        $box = $('.navbar div[data-familytreetop="familyline"]');
        $box.find('button:not(.disabled)').each($fn.buttonsClick);
        $box.find('button.disabled canvas').each($fn.renderCharts);
    }

    $this.bind = function(el, gedcom_id){
        $pull.push({target:el, gedcom_id: gedcom_id});
    }
});