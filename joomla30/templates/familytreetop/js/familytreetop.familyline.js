$FamilyTreeTop.create("familyline", function($){
    'use strict';
    var $this = this,
        $box,
        $pull = [],
        $active = false,
        $fn;

    $fn = {
        renderChart: function(object, total){
            var canvas = object.canvas,
                ctx = object.ctx,
                index = object.index,
                lastend = Math.PI * 1.5,
                myTotal = 0,
                myColor = ['#c2c3c2','#22b14c','#c2c3c2'],
                e,
                i;

            for( e = 0; e < total.length; e++){
                myTotal += total[e];
            }

            for (i = 0; i < total.length; i++){
                ctx.fillStyle = index ? myColor[i] : myColor[i+1];
                ctx.beginPath();
                ctx.moveTo(canvas.width/2,canvas.height/2);
                ctx.arc(canvas.width/2,canvas.height/2,canvas.height/2,lastend,lastend+(Math.PI*2*(total[i]/myTotal)),false);
                ctx.lineTo(canvas.width/2,canvas.height/2);
                ctx.fill();
                lastend += Math.PI*2*(total[i]/myTotal);
            }
        },
        renderCharts:function(data){
            var cnvs = [], total;
            $(data).each(function(i,e){
                cnvs.push({ canvas:e, ctx: e.getContext("2d"), index: i, total: parseInt($(e).attr('familytreetop-data')) });
            });
            total = cnvs[0].total + cnvs[1].total;
            $fn.renderChart(cnvs[0], [cnvs[0].total, cnvs[1].total]);
            $fn.renderChart(cnvs[1], [cnvs[0].total, cnvs[1].total]);
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
                        args = { type:"adjust", active: 0, line: line};
                        $active = false;
                    } else {
                        $(icon).addClass('icon-adjust-active');
                        $($this).addClass(btnGroup);
                        args = {type:"adjust", active: 1, line: line};
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
            var method = (args.line)?"is_father_line":"is_mother_line",
                active = (args.active)?"show":"hide",
                el = item.target,
                user = $this.mod('usertree').user(item.gedcom_id);

            if(user[method]){
                $(el)[active]();
            }
        },
        adjust: function(item, args){
            var method = (args.line)?"is_father_line":"is_mother_line",
                user = $this.mod('usertree').user(item.gedcom_id),
                el = item.target;

            if(user[method]){
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
        $fn.renderCharts($box.find('button.disabled canvas'));
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