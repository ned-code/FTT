/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/


var jlinkDialog;

(function()
{

 


CKEDITOR.dialog.add( 'jlink', function( editor )
{	

	var pluginPath = editor.plugins.jlink.path;
	var getFunctionsUrl = pluginPath + "dialogs/suggest.php?";
	var httpRequestKeyword = "";
	var userKeyword = "";
	var suggestions = 0;
	var suggestionMaxLength = 50;
	var isKeyUpDownPressed = false;
	var autocompletedKeyword = "";
	var hasResults = false;
	var timeoutId = -1;
	var position = -1;
	var oCache = new Object();
	var minVisiblePosition = 0;
	var maxVisiblePosition = 9;
	var debugMode = true;
	var LinkNames = null;
	var CKXml;
	var CacheKeyword = "";
	var phpHelpUrl="";
	phpHelpUrl = editor.config.baseHref;



	var init = function() {
	    var oKeyword = document.getElementById("keyword");
	    oKeyword.value = "";
	    oKeyword.focus();
		CKEDITOR.tools.setTimeout(checkForChanges,500);
	};
	var addToCache = function (keyword, values) {
	    oCache[keyword] = new Array();
	    for (i = 0; i < values.length; i++) oCache[keyword][i] = values[i];
	};
	
	var inCacheObj = function(keyword) {
	    for (var key in oCache) {
	        if (key.toLowerCase() == keyword.toLowerCase()) {
	            CacheKeyword = key;
	            return true;
	        }
	    };
	    return false;
	};
	var checkCache = function(keyword) {
	    if (inCacheObj(keyword)) return true;
	    for (i = keyword.length - 2; i >= 0; i--) {
	        var currentKeyword = keyword.length > 1 ? keyword.substring(0, i + 1) : keyword;
	        if (inCacheObj(currentKeyword)) {
	            var cacheResults = oCache[CacheKeyword];
	            var keywordResults = new Array();
	            var keywordResultsSize = 0;
	            for (j = 0; j < cacheResults.length; j++) {
	                if (cacheResults[j].toLowerCase().indexOf(keyword.toLowerCase()) == 0) {
	                    keywordResults[keywordResultsSize++] = cacheResults[j];
	                }
	            };
	            addToCache(keyword, keywordResults);
	            return true;
	        }
	    };
	    return false;
	};
	var getSuggestions =   function getSuggestions(keyword, oCKXml) {
	    if (keyword != "" && !isKeyUpDownPressed) {
			
	        var isInCache = checkCache(keyword);	
	        if (isInCache == true) {
	            httpRequestKeyword = keyword;
	            userKeyword = keyword;
	            displayResults(keyword, oCache[CacheKeyword], oCKXml);
	        } else {
	            try {
						if (oCKXml.xmlHttpGetSuggestions.readyState == 4 || oCKXml.xmlHttpGetSuggestions.readyState == 0) {
	                    httpRequestKeyword = keyword;
	                    userKeyword = keyword;
					    CKXml.LoadUrl(getFunctionsUrl + "keyword=" + encode(keyword), handleGettingSuggestions);
	                } else {
	                    userKeyword = keyword;
	                    if (timeoutId != -1) clearTimeout(timeoutId);
							timeoutId = CKEDITOR.tools.setTimeout(getSuggestions, 500, this, [userKeyword,CKXml]);
			            }
	            } catch(e) {
	                displayError("Can't connect to server:\n" + e.toString());
	            }
	        }
	    }
	};
	var xmlToArray = function (resultsXml) {
	    var resultsArray = new Array();
	    for (i = 0; i < resultsXml.length; i++) resultsArray[i] = resultsXml.item(i).firstChild.data;
	    return resultsArray;
	};
	var handleGettingSuggestions = function (oCKXml) {
	    try {
	        updateSuggestions(oCKXml);
	    } catch(e) {
	        displayError(e.toString());
	    }
	};
	var updateSuggestions = function (oCKXml) {
	    var response = oCKXml.xmlHttpGetSuggestions.responseText;
	    if (response.indexOf("ERRNO") >= 0 || response.indexOf("error:") >= 0 || response.length == 0) throw (response.length == 0 ? "Void server response.": response);
	    response = oCKXml.DOMDocument;
	    if (response.childNodes.length) {
	        nameArray = oCKXml.ToArray("name");
	    };
	    if (httpRequestKeyword == userKeyword) {
	        displayResults(httpRequestKeyword, nameArray, oCKXml);
	    } else {
	        addToCache(httpRequestKeyword, nameArray);
	    }
	};
	var displayResults = function (keyword, results_array, oCKXml) {
		var div = "<table>";
	    var pidArray = new Array();
	    var linkArray = new Array();
	    response = oCKXml.DOMDocument;
		pidArray = oCKXml.ToArray("pid");
	    linkArray = oCKXml.ToArray("link");
	    if (!oCache[keyword] && keyword) {
	        addToCache(keyword, results_array);
	    };
	    if (results_array.length == 0) {
	        div += "<tr><td>No results found for <strong>" + keyword + "</strong></td></tr>";
	        hasResults = false;
	        suggestions = 0;
	    } else {
	        position = -1;
	        isKeyUpDownPressed = false;
	        hasResults = true;
	        suggestions = oCache[keyword].length;
	        LinkNames = null;
	        LinkNames = new Object();
	        for (var i = 0; i < oCache[keyword].length; i++) {
	            var offset = 0;
	            for (var j = i + offset; j < nameArray.length; j++) {
	                if (nameArray[j].toLowerCase().indexOf(keyword.toLowerCase()) == 0) {
	                    offset = j;
	                    break;
	                }
	            };
				pidArray[offset] = linkArray[offset] + (pidArray[offset] > 0 ? "&amp;Itemid=" + pidArray[offset] : '');
	            crtFunction = oCache[keyword][i];
	            LinkNames["a" + i] = crtFunction;
				 OnMtxtHref = 'onclick="' + "jlinkDialog.AssignValues('" + pidArray[offset] + "',this);return false;" + '"';
	            crtFunctionLink = crtFunction;
	            while (crtFunctionLink.indexOf("_") != -1) crtFunctionLink = crtFunctionLink.replace("_", "-");
	            div += "<tr id=\"tr" + i + "\" onclick='return false;' ondblclick='jlinkDialog.handleOnMouseClick(this);' " + "onmouseover='jlinkDialog.handleOnMouseOver(this);' " + "onmouseout='jlinkDialog.handleOnMouseOut(this);'>" + "<td align='left'><a " + OnMtxtHref + "id=\"a" + i + "\" href='" + phpHelpUrl + '/';
	            div += pidArray[offset];
	            if (crtFunction.length <= suggestionMaxLength) {
					div += "' title='Double click this link to view page'><b>" + crtFunction.substring(0, httpRequestKeyword.length) + "</b>";
					div += crtFunction.substring(httpRequestKeyword.length, crtFunction.length) + "</a></td></tr>";
				} else {
					if (httpRequestKeyword.length < suggestionMaxLength) {
						div += "'><b>" + crtFunction.substring(0, httpRequestKeyword.length) + "</b>";
						div += crtFunction.substring(httpRequestKeyword.length, suggestionMaxLength) + "</a></td></tr>";
					} else {
						div += "'><b>" + crtFunction.substring(0, suggestionMaxLength) + "</b></td></tr>"
					}
				}
			}
		};
	    div += "</table>";
	    var oSuggest = CKEDITOR.document.getById("suggest");
	    var oScroll = CKEDITOR.document.getById("scroll");
	    oScroll.setAttribute('scrollTop',0);
	    oSuggest.setHtml(div);
	    oScroll.setStyle("visibility", "visible");
	    if (results_array.length > 0) autocompleteKeyword();
	};
	
	var checkForChanges = function () {
		var elem = CKEDITOR.document.getById("keyword");
		if(elem)
		{
			var keyword = elem.getValue();
			if (keyword == "") {
				hideSuggestions();
				userKeyword = "";
				httpRequestKeyword = "";
				CKEDITOR.document.getById("suggest").setHtml("");
			};
			CKEDITOR.tools.setTimeout(checkForChanges,500);
			if (keyword.length == 1 && !CKEDITOR.document.getById("tr0") || 
			(userKeyword != keyword && (!isKeyUpDownPressed) && autocompletedKeyword != keyword) || 
			(keyword.length > 0 && !CKEDITOR.document.getById("tr0"))) 
			{
				getSuggestions(keyword, CKXml);
			}
		}
	};
	var deselectAll = function() {
	    for (i = 0; i < suggestions; i++) {
	        var oCrtTr = CKEDITOR.document.getById("tr" + i);
	        oCrtTr.removeClass('highlightrow');
	    }
	};
	var handleOnMouseOver = function (oTr) {
	    deselectAll();
	    oTr.className = "highlightrow";
	    position = oTr.id.substring(2, oTr.id.length);
	};
	var handleOnMouseOut = function (oTr) {
	    oTr.className = "";
	    position = -1;
	};
	var handleOnMouseClick = function (otr) {
	    window.open(CKEDITOR.document.getById("a" + otr.id.replace("tr", "")).getAttribute("href"), 'open_window', 'menubar,toolbar,location,directories,status,scrollbars,resizable,dependent,width=640,height=480,left=0,top=0');
	};
	
	var AssignValues = function (link, elem) {
    	CKEDITOR.document.getById("txtHref").setValue(link);
    	CKEDITOR.document.getById("txtCaption").setValue(LinkNames[elem.id]);
	};
	
	var encode = function (uri) {
	    if (encodeURIComponent) {
	        return encodeURIComponent(uri);
	    };
	    if (escape) {
	        return escape(uri);
	    }
	};
	
	
	var hideSuggestions = this.hideSuggestions =  function hideSuggestions() {
	    var oScroll = CKEDITOR.document.getById("scroll");
	    var elem = CKEDITOR.document.getById("keyword");
	    if (elem.getValue() == "") oScroll.setStyle("visibility","hidden");
};
	
	var selectRange = function (oText, start, length) {
	    if (oText.setSelectionRange) {
	        oText.setSelectionRange(start, length);
	    } else if (oText.createTextRange) {
	        var oRange = oText.createTextRange();
	        oRange.moveStart("character", start);
	        oRange.moveEnd("character", length - oText.value.length);
	        oRange.select();
	    };
	    oText.focus();
	};
	var autocompleteKeyword = function () {
	    if (CKEDITOR.document.getById("tr0")) {
	        var oKeyword = CKEDITOR.document.getById("keyword");
	        position = 0;
	        deselectAll();
	        CKEDITOR.document.getById("tr0").addClass("highlightrow");
	        selectRange(oKeyword, httpRequestKeyword.length, oKeyword.getValue().length);
	        autocompletedKeyword = oKeyword.getValue();
	    }
	};
	var displayError = function (message) {
	    alert("Error accessing the server! " + (debugMode ? "\n" + message: ""));
	};

	return {
		title : editor.lang.jlink.title,
		minWidth : 400,
		minHeight : 350,
		onLoad : function()
		{
			jlinkDialog = {
				hideSuggestions : hideSuggestions,
				handleOnMouseOver : handleOnMouseOver,
				handleOnMouseOut : handleOnMouseOut,
				handleOnMouseClick : handleOnMouseClick,
				AssignValues : AssignValues
			
			}

		
		},
		onShow : function()
		{
			
			var editor = this.getParentEditor(),
			selection = editor.getSelection(),
			ranges = selection.getRanges(),
			element = null;
			
			//load stylesheet
			var head = CKEDITOR.document.getHead();
			head.append(
					CKEDITOR.document.createElement( 'link',
						{
							attributes :
								{
									type : 'text/css',
									rel : 'stylesheet',	
									href : pluginPath + 'dialogs/suggest.css'
								}
						})
				);
			 
	
		
			// Fill in all the relevant fields if there's already one link selected.
			if ( ranges.length == 1 )
			{

				var rangeRoot = ranges[0].getCommonAncestor( true );
				element = rangeRoot.getAscendant( 'a', true );
				if ( element && element.getAttribute( 'href' ) )
				{
					selection.selectElement( element );
					CKEDITOR.document.getById('txtHref').setValue(element.getAttribute('href').replace(/^https?.+\/index.php/, 'index.php'));
					CKEDITOR.document.getById('txtCaption').setValue(element.getText());
					// Record down the selected element in the dialog.
					this._.selectedElement = element;
				}
			}
			
			// Preview
			this.preview = CKEDITOR.document.getById( 'previewImage' );
			if(!CKXml)
				CKXml = new CXmlAjax();	
			init();	
		},
		onOk : function()
		{
						
			var editor = this.getParentEditor(),
				txtHref = CKEDITOR.document.getById('txtHref').getValue(),
    			txtCaption = CKEDITOR.document.getById('txtCaption').getValue(),
				attributes = 
				{ 
					href : 	txtHref
				};
			
				
			if ( !this._.selectedElement )
			{
				// Create element if current selection is collapsed.
				var selection = editor.getSelection(),
					ranges = selection.getRanges();
				if ( ranges.length == 1 && ranges[0].collapsed )
				{
					var text = new CKEDITOR.dom.text( txtCaption, editor.document );
					ranges[0].insertNode( text );
					ranges[0].selectNodeContents( text );
					selection.selectRanges( ranges );
				}

				// Apply style.
				var style = new CKEDITOR.style( { element : 'a', attributes : attributes } );
				style.type = CKEDITOR.STYLE_INLINE;		// need to override... dunno why.
				style.apply( editor.document );

			
			}
			else
			{
				// We're only editing an existing link, so just overwrite the attributes.
				var element = this._.selectedElement;
				element.setAttributes( attributes );
				element.setText(txtCaption);		
				delete this._.selectedElement;
			}
				
		},
		onClose : function()
		{
			CKXml = null;
			jlinkDialog = null;
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.jlink.info,
				accessKey : 'I',
				elements :
				[
					{
						type : 'vbox',
						padding : 0,
						children :
						[
							{
								type : 'html',
								html : '<span>URL:</span>'
							},
							{
								type : 'vbox',
								children :
								[
								
									{
										
										type : 'html',
										html : '<div class="cke_dialog_ui_input_text" ><input name="txtHref" id="txtHref" maxlength="150"  value="" type="text" /></div>',
										validate : function()
										{
											var dialog = this.getDialog();

											if ( CKEDITOR.document.getByID('txtHref').getValue() )
												return true;

											var func = CKEDITOR.dialog.validate.notEmpty( editor.lang.jlink.noUrl );
											return func.apply( this );
										}
									}	
								
								]
							},
							{
								type : 'html',
								html : '<span>Caption:</span>'
							},
							{
								type : 'vbox',
								children :
								[
									{
										
										type : 'html',
										html : '<div class="cke_dialog_ui_input_text" ><input name="txtCaption" id="txtCaption" maxlength="150"  value="" type="text" /></div>'
										
									}
									
								]
							}
						]
					},
					{
					type : 'html',
						html : '<div><div id="message">Enter the first letters of the article title: </div>' +
								'<div onclick="jlinkDialog.hideSuggestions();" class="cke_dialog_ui_input_text" ><input name="keyword" id="keyword" maxlength="150"  value="" type="text" /></div></div>'
					
					},
					
					{
						type : 'hbox',
						children :
						[
							{
								type : 'html',
								style : 'width:100%;',
								html : '<div id="content" onclick="jlinkDialog.hideSuggestions();">' +
								'<div id="scroll">' +
								'<div id="suggest">' +
								'</div>' + '</div>'
						
							}
						]
					}
				
					
				]
			}
		]
	};
});


var CXmlAjax = function() {
			this.xmlHttpGetSuggestions =  (function()
			{
				if ( !CKEDITOR.env.ie || location.protocol != 'file:' )
					try { return new XMLHttpRequest(); } catch(e) {}
		
				try { return new ActiveXObject( 'Msxml2.XMLHTTP' ); } catch (e) {}
				try { return new ActiveXObject( 'Microsoft.XMLHTTP' ); } catch (e) {}
				return null;
		
			})();
		}


CXmlAjax.prototype.LoadUrl = function(urlToCall, asyncFunctionPointer) {
    var oCKXml = this;
    var bAsync = (typeof(asyncFunctionPointer) == 'function');
    this.xmlHttpGetSuggestions.open("GET", urlToCall, bAsync);
    if (oCKXml.xmlHttpGetSuggestions) {
        if (bAsync) {
            this.xmlHttpGetSuggestions.onreadystatechange = function() {
                if (oCKXml.xmlHttpGetSuggestions.readyState == 4) {
                    if ((oCKXml.xmlHttpGetSuggestions.status != 200 && oCKXml.xmlHttpGetSuggestions.status != 304) || oCKXml.xmlHttpGetSuggestions.responseXML == null || oCKXml.xmlHttpGetSuggestions.responseXML.firstChild == null) {
                        throw new Error('The server didn\'t send back a proper XML response. Please contact your system administrator.\n\n' + 'XML request error: ' + oCKXml.xmlHttpGetSuggestions.statusText + ' (' + oCKXml.xmlHttpGetSuggestions.status + ')\n\n' + 'Requested URL:\n' + urlToCall + '\n\n' + 'Response text:\n' + oCKXml.xmlHttpGetSuggestions.responseText);
                    };
                    oCKXml.DOMDocument = oCKXml.xmlHttpGetSuggestions.responseXML;
                    asyncFunctionPointer(oCKXml);
                }
            }
        };
        oCKXml.xmlHttpGetSuggestions.send(null);
        if (!bAsync) {
            if (oCKXml.xmlHttpGetSuggestions.status == 200 || oCKXml.xmlHttpGetSuggestions.status == 304) oCKXml.DOMDocument = oCKXml.xmlHttpGetSuggestions.responseXML;
            else {
                throw new Error('XML request error: ' + oCKXml.xmlHttpGetSuggestions.statusText + ' (' + oCKXml.xmlHttpGetSuggestions.status + ')');
            }
        }
    }
}

CXmlAjax.prototype.ToArray = function(tagName) {
    var resultsXml = this.DOMDocument.getElementsByTagName(tagName);
    var resultsArray = new Array();
    for (i = 0; i < resultsXml.length; i++) resultsArray[i] = resultsXml.item(i).firstChild.data;
    return resultsArray;
}
})();