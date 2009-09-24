MTools.Browser = {
  IE:     !!(window.attachEvent && !window.opera), 
  IE7:    (/MSIE\s7/).test(navigator.appVersion), 
  IE6:    (/MSIE\s6/).test(navigator.appVersion), 
  Opera:  !!window.opera, 
  WebKit: (/AppleWebKit/).test(navigator.appVersion),
  KHTML:  (/Konqueror|Safari|KHTML/).test(navigator.userAgent), 
  Gecko:  (/Gecko/).test(navigator.userAgent) && !(/KHTML/).test(navigator.userAgent)
};
