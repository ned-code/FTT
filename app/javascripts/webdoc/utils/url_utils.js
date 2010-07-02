/**
 * @author Jonathan Biolaz
 */
WebDoc.UrlUtils = {
  
  consolidateSrc : function(src) {
    var pattern_has_protocole = /^(ftp|http|https):\/\//;
    var consolidateSrc = '';
    if (src.match(pattern_has_protocole)) {
	    consolidateSrc = src;
    }
    else {
	    consolidateSrc = "http://" + src;
    }
    return consolidateSrc;
  }
};