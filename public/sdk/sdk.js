/*global window,widget,uniboard,localizedStrings,wd_install_message_listener,XMLHttpRequest,ActiveXObject*/
/*jslint evil: true */ /*indication for JSLInt*/
if(typeof(widget)==="undefined"){throw ("Missing widget Object");}widget.log=function(a){if(typeof window.console!="undefined"){window.console.log(a);}};widget.setAutoRefresh=function(a){this.autoRefreshDelay=a;if(a===0){if(this.autoRefreshTimeout!==null){window.clearTimeout(this.autoRefreshTimeout);this.autoRefreshTimeout=null;}}else{if(this.autoRefreshTimeout===null){this.autoRefreshTimeout=window.setTimeout(widget._onRefresh,this.autoRefreshDelay*1000);}}};widget._onLoad=function(a){if(typeof(a)=="undefined"){this.body=window.document.body;}else{this.body=a;}window.document.onkeydown=function(b){widget._handleKeys(b);};window.document.onkeypress=function(b){widget._handleKeys(b);};this._callListenersForEvent("_load");widget.onLoad();this._callListenersForEvent("load");};widget._onRefresh=function(){if(this.autoRefreshDelay!==0){window.setTimeout(widget._onRefresh,this.autoRefreshDelay*1000);}else{this.autoRefreshTimeout=null;}this.onRefresh();};widget._onPreferencesChange=function(){this.onPreferencesChange();};widget._onModeChange=function(){this.onModeChange();};widget._onLanguageChange=function(){this.onLanguageChange();};widget._addEventListener=function(b,a){this.eventsListener.push([b,a]);};widget._callListenersForEvent=function(b){for(var a=0;a<this.eventsListener.length;a++){if(this.eventsListener[a][0]==b){this.eventsListener[a][1]();}}};widget._handleKeys=function(b){var a=(b)?b:window.event;var d;if(a.type=="keydown"){d=a.keyCode;if(d<16||(d>16&&d<32)||(d>32&&d<41)||d==46){this.onKeyboardAction(d,true);}}else{d=a.charCode;if(d!==0){this.onKeyboardAction(d,false);}}};var JSONstring={compactOutput:false,includeProtos:false,includeFunctions:false,detectCirculars:true,restoreCirculars:true,make:function(a,b){this.restore=b;this.mem=[];this.pathMem=[];return this.toJsonStringArray(a).join("");},toObject:function(x){if(!this.cleaner){try{this.cleaner=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$');}catch(a){this.cleaner=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/;}}if(!this.cleaner.test(x)){return{};}eval("this.myObj="+x);if(!this.restoreCirculars||!window.alert){return this.myObj;}if(this.includeFunctions){var x2=this.myObj;for(var i in x2){if(typeof x2[i]=="string"&&!x2[i].indexOf("JSONincludedFunc:")){x2[i]=x2[i].substring(17);eval("x[i]="+x2[i]);}}}this.restoreCode=[];this.make(this.myObj,true);var r=this.restoreCode.join(";")+";";eval('r=r.replace(/\\W([0-9]{1,})(\\W)/g,"[$1]$2").replace(/\\.\\;/g,";")');eval(r);return this.myObj;},toJsonStringArray:function(t,g){if(!g){this.path=[];}g=g||[];var s;switch(typeof t){case"object":this.lastObj=t;if(this.detectCirculars){var d=this.mem;var c=this.pathMem;for(var o=0;o<d.length;o++){if(t===d[o]){g.push('"JSONcircRef:'+c[o]+'"');return g;}}d.push(t);c.push(this.path.join("."));}if(t){if(t.constructor==Array){g.push("[");for(var h=0;h<t.length;++h){this.path.push(h);if(h>0){g.push(",\n");}this.toJsonStringArray(t[h],g);this.path.pop();}g.push("]");return g;}else{if(typeof t.toString!="undefined"){g.push("{");var p=true;for(var f in t){if(true){if(!this.includeProtos&&t[f]===t.constructor.prototype[f]){continue;}this.path.push(f);var v=g.length;if(!p){g.push(this.compactOutput?",":",\n");}this.toJsonStringArray(f,g);g.push(":");this.toJsonStringArray(t[f],g);if(g[g.length-1]==s){g.splice(v,g.length-v);}else{p=false;}this.path.pop();}}g.push("}");return g;}}return g;}g.push("null");return g;case"unknown":case"undefined":case"function":if(!this.includeFunctions){g.push(s);return g;}t="JSONincludedFunc:"+t;g.push('"');var q=["\n","\\n","\r","\\r",'"','\\"'];t+="";for(var r=0;r<6;r+=2){t=t.split(q[r]).join(q[r+1]);}g.push(t);g.push('"');return g;case"string":if(this.restore&&t.indexOf("JSONcircRef:")===0){this.restoreCode.push("this.myObj."+this.path.join(".")+"="+t.split("JSONcircRef:").join("this.myObj."));}g.push('"');var b=["\n","\\n","\r","\\r",'"','\\"'];t+="";for(var e=0;e<6;e+=2){t=t.split(b[e]).join(b[e+1]);}g.push(t);g.push('"');return g;default:g.push(String(t));return g;}}};if(typeof(JSONstring)==="undefined"){throw ("Missing JSONstring Object");}function wd_log(a){if(typeof window.console!="undefined"){window.console.log(a);}}function object_to_json(a){JSONstring.compactOutput=true;JSONstring.includeProtos=false;JSONstring.includeFunctions=false;JSONstring.detectCirculars=true;JSONstring.restoreCirculars=true;return JSONstring.make(a);}function JSON_to_text(a){wd_log("deprecated. Need to be replaced by object_to_json");return object_to_json(a);}function json_to_object(a){return JSONstring.toObject(a);}function text_to_JSON(a){wd_log("deprecated. Need to be replaced by json_to_object");return json_to_object(a);}function wd_check_is_valid_message(a){if(typeof a.methodName!=="string"){wd_log("Communication message is not valid. message.methodName doesn't exist or is not a string.");return false;}if(typeof a.parameters!="array"){wd_log("Communication message is not valid. message.parameters doesn't exist or is not an array.");return false;}}function wd_build_communication_message(b,c){var a={};a.methodName=b;a.parameters=c;return a;}function wd_message_relay(message){var func=message.methodName+"(";for(var i=0;i<message.parameters.length;i++){if(i!==0){func+=",";}var s=typeof message.parameters[i]=="string"?true:false;if(s){func+="'";}func+=message.parameters[i];if(s){func+="'";}}func+=")";eval(func);}function wd_install_message_listener(){window.addEventListener("message",function(b){var a=json_to_object(b.data);if(!wd_check_is_valid_message(a)){return;}wd_message_relay(a);},false);}function getXmlHttp(){var a;if(window.XMLHttpRequest){a=new XMLHttpRequest();}else{if(window.ActiveXObject){a=new ActiveXObject("Microsoft.XMLHTTP");}}if(a===null){window.alert("Your browser does not support XMLHTTP.");}return a;}function readFileHttp(g,f,e,b){var a=getXmlHttp();if(a===null){return;}a.onreadystatechange=function(){if(a.readyState==4){if(e===null||e===false){f(a.responseXML);}else{f(a.responseText);}}};if(b===null||b===true){a.open("GET",g,true);a.send(null);}else{a.open("GET",g,false);var d=window.setTimeout(function(){a.abort();},1000);try{a.send(null);}catch(c){}window.clearTimeout(d);f(a.responseText);}}if(typeof(widget)==="undefined"){throw ("Missing widget Object");}if(typeof(wd_install_message_listener)==="undefined"){throw ("Missing wd_install_message_listener Function");}widget.communication={_init:function(){widget._addEventListener("load",widget.communication._onLoad);},_onLoad:function(){wd_install_message_listener();}};widget.communication._init();if(typeof(widget)==="undefined"){throw ("Missing widget Object");}if(typeof(uniboard)==="undefined"){throw ("Missing uniboard Object");}widget.datastore={server_url:"/items/",set:function(b,e,c,g){var a=widget.datastore.server_url;a+=widget.uuid+"/datastore_entries";var f=null;if(typeof(g)!="undefined"){f=g;}var d={"datastore_entries[key]":b,"datastore_entries[value]":e,"datastore_entries[unique_key]":c};uniboard.network.local.postText(a,d,widget.datastore._setCallback,f);},get:function(b,d){var a=widget.datastore.server_url;a+=widget.uuid+"/datastore_entries?key="+b;var c=null;if(typeof(d)!="undefined"){c=d;}uniboard.network.local.getJson(a,widget.datastore._getCallback,c);},getExtended:function(b,d){var a=widget.datastore.server_url;a+=widget.uuid+"/datastore_entries?key="+b;var c=null;if(typeof(d)!="undefined"){c=d;}uniboard.network.local.getJson(a,widget.datastore._getExtendedCallback,c);},getForCurrentUser:function(b,d){var a=widget.datastore.server_url;a+=widget.uuid+"/datastore_entries/"+b;var c=null;if(typeof(d)!="undefined"){c=d;}uniboard.network.local.getJson(a,widget.datastore._getForCurrentUserCallback,c);},remove:function(b,d){var a=widget.datastore.server_url;a+=widget.uuid+"/datastore_entries/"+b;var c=null;if(typeof(d)!="undefined"){c=d;}uniboard.network.local.deleteText(a,widget.datastore._removeCallback,c);},removeAll:function(c){var a=widget.datastore.server_url;a+=widget.uuid+"/datastore_entries/";var b=null;if(typeof(c)!="undefined"){b=c;}uniboard.network.local.deleteText(a,widget.datastore._removeAllCallback,b);},getAllKeys:function(c){var a=widget.datastore.server_url;a+="getAllKeys?widget_uuid="+widget.uuid;var b=null;if(typeof(c)!="undefined"){b=c;}uniboard.network.local.getJson(a,widget.datastore._getAllKeysCallback,b);},_setCallback:function(b,a,c){if(typeof(c)=="function"){if(a!==null){c(b,a);}else{if(b===""){c(null,null);}else{c(b,null);}}}},_getCallback:function(d,b,e){if(typeof(e)!="function"){return;}if(b!==null){e(null,b);return;}var a=[];if(d){for(var c=0;c<d.length;c++){a[c]=d[c].datastore_entry.ds_value;}}e(a,null);},_getExtendedCallback:function(d,b,e){if(typeof(e)!="function"){return;}if(b!==null){e(null,b);return;}var a=[];if(d){for(var c=0;c<d.length;c++){a[c]={value:d[c].datastore_entry.ds_value,email:null,updated_at:null};if(d[c].datastore_entry.updated_at!==undefined){a[c].email=d[c].datastore_entry.email;a[c].updated_at=d[c].datastore_entry.updated_at;}}}e(a,null);},_getForCurrentUserCallback:function(c,b,d){if(typeof(d)!="function"){return;}if(b!==null){d(null,b);return;}var a=null;if(c){if(c.length>0){a=c[0].datastore_entry.ds_value;}}d(a,null);},_removeCallback:function(b,a,c){if(typeof(c)=="function"){if(a!==null){c(b,a);}else{if(b===""){c(null,null);}else{c(b,null);}}}},_removeAllCallback:function(b,a,c){if(typeof(c)=="function"){if(a!==null){c(b,a);}else{if(b===""){c(null,null);}else{c(b,null);}}}},_getAllKeysCallback:function(d,b,e){if(typeof(e)!="function"){return;}if(b!==null){e(null,b);return;}var a=[];for(var c=0;c<d.length;c++){a[c]=d[c].ds_key;}e(a,null);},computer:{save:function(a,b){window.localStorage.setItem(a,b);},get:function(a){return window.localStorage.getItem(a);},remove:function(a){window.localStorage.removeItem(a);},getAllKeys:function(){var a=[];for(var b=0;b<window.localStorage.length;b++){a[b]=window.localStorage.key(b);}return a;}}};if(typeof(widget)==="undefined"){throw ("Missing widget Object");}widget.messages={sendMessage:function(a,b){window.alert("widget.messages.sendMessage not implemented yet.");},subscribeToTopic:function(b,a){window.alert("widget.messages.subscribeToTopic not implemented yet.");},unsubscribeOfTopic:function(a){window.alert("widget.messages.unsubscribeOfTopic not implemented yet.");}};if(typeof(widget)==="undefined"){throw ("Missing widget Object");}if(typeof(uniboard)==="undefined"){throw ("Missing uniboard Object");}widget.network={getUrl:function(a,c,b){uniboard.network.getUrl(a,c,b);},postUrl:function(a,b,d,c){uniboard.network.postUrl(a,b,d,c);},putUrl:function(a,b,d,c){uniboard.network.putUrl(a,b,d,c);},deleteUrl:function(a,c,b){uniboard.network.deleteUrl(a,c,b);}};if(typeof(widget)==="undefined"){throw ("Missing widget Object");}if(typeof(uniboard)==="undefined"){throw ("Missing uniboard Object");}widget.preferences={viewContent:"",getValue:function(b,a){return uniboard.preference(b,a);},setValue:function(a,b){uniboard.setPreference(a,b);},_init:function(){},_onLoad:function(){var a=window.document.createElement("div");a.style.position="absolute";a.style.top=0;a.style.right=0;a.innerHTML='<a href="javascript:widget.preferences._renderEditPane();">[Edit]</a>';widget.body.appendChild(a);},_renderEditPane:function(){this.viewContent=widget.body.innerHTML;var c;var b=[];b[0]=["key1","value 1",false];b[1]=["key2","value 2",true];c="EDIT PREFERENCES<br><br><table>";for(var a=0;a<b.length;a++){c+="<tr><td>"+b[a][0]+" : </td><td>";if(!b[a][2]){c+='<input type="textbox" id="pref_'+b[a][0]+'" value="';var d=this.getValue(b[a][0]);if(typeof(d)=="undefined"||d===""){c+=b[a][1];}else{c+=d;}c+='" />';}else{c+=b[a][1];}c+="</td></tr>";}c+='</table><br><input type="button" value="Cancel" onclick="javascript:widget.preferences._closePreferences();" /> <input type="button" value="Save" onclick="javascript:widget.preferences._saveAndClosePreferences();" />';widget.body.innerHTML=c;},_saveAndClosePreferences:function(){var c=[];c[0]=["key1","value 1",false];c[1]=["key2","value 2",true];for(var b=0;b<c.length;b++){var a=window.document.getElementById("pref_"+c[b][0]);if(!c[b][2]&&a){this.setValue(c[b][0],a.value);}}this.onPreferencesChange();this._closePreferences();widget._onRefresh();},_closePreferences:function(){widget.body.innerHTML=this.viewContent;widget._onRefresh();}};widget.preferences._init();if(typeof(widget)==="undefined"){throw ("Missing widget Object");}if(typeof(localizedStrings)==="undefined"){}widget.internationalization={getLocalizedString:function(c,a){if(typeof(localizedStrings)!="undefined"&&localizedStrings!==null){var b=localizedStrings[c];if(typeof(b)!="undefined"){return b;}}if(typeof(a)!="undefined"){return a;}return c;},setLanguage:function(a){widget.lang=a;widget.internationalization._loadLocaleScript();},_init:function(){widget._addEventListener("_load",widget.internationalization._onLoad);},_onLoad:function(){widget.internationalization._loadLocaleScript();},_loadLocaleScript:function(){var a=window.document.getElementById("language_script");if(a){window.document.getElementsByTagName("head")[0].removeChild(a);}var b=window.document.createElement("script");b.src="Locales/"+widget.lang+"/localizedStrings.js";b.id="language_script";b.type="text/javascript";b.onload=function(){widget._onLanguageChange();};window.document.getElementsByTagName("head")[0].appendChild(b);}};widget.internationalization._init();function _(b,a){return widget.internationalization.getLocalizedString(b,a);}