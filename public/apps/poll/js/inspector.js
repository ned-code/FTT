var widgetIframe;

$(document).ready(function() {
    // setInterval(heightResize, 100);
    // widgetIframe = $(parent.document).find("#inspector");
});

function heightResize(){
  var widgetHeight = $('.inspector').height();
  var widgetIframeHeight = widgetIframe.height();
  widgetIframe.removeAttr("height").css({ height: widgetHeight+25 });
}