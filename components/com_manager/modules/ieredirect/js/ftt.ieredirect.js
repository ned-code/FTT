function JMBIeredirectObject(parent){
    var module = this,
        sb = storage.stringBuffer(),
        fn,
        object,
        url = {
            chrome:"https://www.google.com/intl/en/chrome/browser/",
            safari:"http://www.apple.com/safari/",
            firefox:"http://www.mozilla.org/en-US/",
            ie:"http://windows.microsoft.com/en-US/internet-explorer/downloads/ie"
        },
        msg = {
            FTT_MOD_IEREDIRECT_MESSAGE1: "Sorry, Family TreeTop currently does not support your version of Internet Explorer",
            FTT_MOD_IEREDIRECT_MESSAGE2: "If you'd like to use FamilyTreeTop, please use one of the following browsers",
            FTT_MOD_IEREDIRECT_WINDOW_NAME: "Following browser"
        };

    fn = {
        getMsg:function(n){
            var t = 'FTT_MOD_IEREDIRECT_'+n.toUpperCase();
            if(typeof(msg[t]) != 'undefined'){
                return msg[t];
            }
            return '';
        },
        setMsg:function(m){
            for(var key in msg){
                if(typeof(msg[key]) != 'undefined'){
                    msg[key] = m[key];
                }
            }
            return true;
        }
    }

    sb._('<div>');
        sb._('<div class="message1">')._(fn.getMsg('message1'))._('.</div>');
        sb._('<div class="message2">')._(fn.getMsg('message2'))._(':</div>');
        sb._('<div>');
            sb._('<ul>');
                sb._('<li><div class="item"><div class="image chrome">&nbsp</div><div class="link"><a target="_blank" href="')._(url.chrome)._('">Chrome</a></div></div></li>');
                sb._('<li><div class="item"><div class="image safari">&nbsp</div><div class="link"><a target="_blank" href="')._(url.safari)._('">Safari</a></div></div></li>');
                sb._('<li><div class="item"><div class="image firefox">&nbsp</div><div class="link"><a target="_blank" href="')._(url.firefox)._('">Firefox</a></div></div></li>');
                sb._('<li><div class="item"><div class="image ie">&nbsp</div><div class="link"><a target="_blank" href="')._(url.ie)._('">Internet Explorer 8+</a></div></div></li>');
            sb._('</ul>');
        sb._('</div>');
    sb._('</div>');
    object = jQuery(sb.result());
    jQuery(object).find('div.image').click(function(){
        var url = jQuery(this).parent().find('a').attr('href');
        window.open(url, fn.getMsg("WINDOW_NAME"), "width=800,height=600");
        return false;
    });
    jQuery(parent).append(object);

}