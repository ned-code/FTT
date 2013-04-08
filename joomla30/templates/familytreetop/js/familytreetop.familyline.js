$FamilyTreeTop.create("familyline", function($){
    'use strict';
    var $this = this,
        $box,
        $fn;

    $fn = {
        renderChart: function(canvas, ctx, index, data){
            var lastend = 0,
                myTotal = 0,
                myColor = ['red','blue','red'],
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
            var $this = this, icon = $($this).find('i'), _class = $(icon).attr('class').split(" ")[0];
            switch(_class){
                case "icon-pencil":
                    if($(icon).hasClass('icon-pencil-active')){
                        $(icon).removeClass('icon-pencil-active');
                        $($this).removeClass('btn-warning');
                    } else {
                        $(icon).addClass('icon-pencil-active');
                        $($this).addClass('btn-warning');
                    }
                    break;

                case "icon-eye-open":
                    $(icon).removeClass('icon-eye-open');
                    $($this).addClass('btn-warning');
                    $(icon).addClass('icon-eye-close');
                    break;

                case "icon-eye-close":
                    $(icon).removeClass('icon-eye-close');
                    $($this).removeClass('btn-warning');
                    $(icon).addClass('icon-eye-open');
                default:
                    break;

            }

        },
        buttonsClick:function(index, el){
            $(el).click($fn.buttonClick);
        }
    }

    $this.init = function(){
        $box = $('.navbar div[data-familytreetop="familyline"]');
        $box.find('button:not(.disabled)').each($fn.buttonsClick);
        $box.find('button.disabled canvas').each($fn.renderCharts);
    }
});