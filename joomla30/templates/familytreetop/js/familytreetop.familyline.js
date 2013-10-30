$FamilyTreeTop.create("familyline", function($){
    'use strict';
    var $this = this,
        $box,
        $pull = [],
        $active = false,
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
            var $this = this, icon = $($this).find('i'), _class = $(icon).attr('class').split(" ")[0], args, line, btnGroup;
            line = ($(icon).attr('familytreetop-line') == "father")?1:0;
            btnGroup = (line)?"btn-success":"btn-warning";
            if($active && $this != $active){
                $($active).click();
            }
            switch(_class){
                case "icon-adjust":
                    if($(icon).hasClass('icon-adjust-active')){
                        $(icon).removeClass('icon-adjust-active');
                        $($this).removeClass(btnGroup);
                        args = { type:"pencil", active: 0, line: line};
                        $active = false;
                    } else {
                        $(icon).addClass('icon-adjust-active');
                        $($this).addClass(btnGroup);
                        args = {type:"pencil", active: 1, line: line};
                        $active = $this;
                    }
                    break;

                case "icon-eye-open":
                    $(icon).removeClass('icon-eye-open');
                    $($this).addClass(btnGroup);
                    $(icon).addClass('icon-eye-close');
                    args = {type:"eye", active: 0, line: line};
                    $active = $this;
                    break;

                case "icon-eye-close":
                    $(icon).removeClass('icon-eye-close');
                    $($this).removeClass(btnGroup);
                    $(icon).addClass('icon-eye-open');
                    args = {type:"eye", active: 1, line: line};
                    $active = false;
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
                    $(el).addClass(args.line?"familytreetop-is-father-line":"familytreetop-is-mother-line");
                } else {
                    $(el).removeClass(args.line?"familytreetop-is-father-line":"familytreetop-is-mother-line");
                }
            }
        },
        send: function(args){
            for(var prop in $pull){
                if(!$pull.hasOwnProperty(prop)) continue;
                $fn[args.type]($pull[prop], args);
            }
        },
        hide: function(){
            $($box).find('.btn:not(.disabled)').hide();
        },
        show: function(){
            $($box).find('.btn:not(.disabled)').show();
        }
    }

    $this.init = function(){
        $box = $('.navbar div[data-familytreetop="familyline"]');
        $box.find('button:not(.disabled)').each($fn.buttonsClick);
        $box.find('button.disabled canvas').each($fn.renderCharts);
        $this.mod('tabs').bind('all', function(e){
            if($(e.target).attr('data-familytreetop') == "family_tree"){
                $fn.hide();
            } else {
                $fn.show();
            }
        });
        $box.find('[familytreetop-tooltip]').each(function(i, e){
            var text = $(e).attr('familytreetop-tooltip');
            $(e).tooltip({
                title: text,
                container: document.body,
                display: { show: 1000, hide: 100 }
            });
        });
    }

    $this.bind = function(el, gedcom_id){
        $pull.push({target:el, gedcom_id: gedcom_id});
    }
});