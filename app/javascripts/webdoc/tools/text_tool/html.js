(function($) {    

  // The following 4 functions were yanked from Prototype proper

  var prepareReplacement = function(replacement) {
    if (jQuery.isFunction(replacement))  {
      return replacement;
    }
    return function(match) { return replacement };
  };

  var blank = function(text) {
    return /^\s*$/.test(text);
  };

  var interpret = function(text) {
    return text == null ? '' : String(text);
  };

  var escapeRegExp = function(string) {
    return String(string).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  };

  var gsub = function(source, pattern, replacement) {
    var result = '', match;
    replacement = prepareReplacement(replacement);

    if (typeof(pattern) == 'string') {
      pattern = escapeRegExp(pattern);
    }

    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  };

  /**
  *  Normalizes and tidies text into XHTML content.
  *
  *  - Strips out browser line breaks, '\r'
  *  - Downcases tag names
  *  - Closes line break tags
  **/
  var tidyXHTML = function(text) {
    // Remove IE's linebreaks
    text = gsub(text, /\r\n?/, "\n");

    // Downcase tags
    text = gsub(text, /<([A-Z]+)([^>]*)>/, function(match) {
      return '<' + match[1].toLowerCase() + match[2] + '>';
    });

    text = gsub(text, /<\/([A-Z]+)>/, function(match) {
      return '</' + match[1].toLowerCase() + '>';
    });

    // Close linebreak elements
    text = text.replace(/<br>/g, "<br />");

    return text;
  };

  /**
  *  Convert browser-created html to something nice and clean
  *
  *  There is no standard formatting among the major browsers for the rich
  *  text output. Safari wraps its line breaks with "div" tags, Firefox puts
  *  "br" tags at the end of the line, and other such as Internet Explorer
  *  wrap lines in "p" tags.
  *
  *  The output is a standarizes these inconsistencies and produces a clean
  *  result. A single return creates a line break "br" and double returns
  *  create a new paragraph. This is similar to how Textile and Markdown
  *  handle whitespace.
  *
  *  Raw browser content => clean() => Textarea
  **/
  var clean = function(dirtyHTML) {    
    var text = tidyXHTML(dirtyHTML);
    if (MTools.Browser.WebKit) {
	  text = text.replace(/<span class="Apple-style-span" style="font-weight: bold;"><br \/><\/span>/g, "<br />");
	  text = text.replace(/<span class="Apple-style-span" style="font-style: italic;"><br \/><\/span>/g, "<br />");
	  text = text.replace(/<span class="Apple-style-span" style="text-decoration: underline;"><br \/><\/span>/g, "<br />");
      // Extra divs expand to line breaks
	  if((/<\/div>$/).test(text))
	  {
		  text = text.replace(/^<div><br \/>/g, "");
		  text = text.replace(/^<div>/g, "");
		  text = text.replace(/<\/div>$/g, "");
	  }
	  text = text.replace(/(<div><br \/>)+/g, "<br />");
      text = text.replace(/(<div>)+/g, "<br />");
      text = text.replace(/(<\/div>)+/g, "");
      // Trash extra paragraphs
      text = text.replace(/<p>\s*<\/p>/g, "");
      // Convert line break tags into real line breaks
      //text = text.replace(/<br \/>(\n)*/g, "\n");
    }
    else if (MTools.Browser.Gecko) {
      // Convert any strangling paragraphs into line breaks
      text = text.replace(/<p>/g, "");
      text = text.replace(/<\/p>(\n)?/g, "\n");

      // Convert line break tags into real line breaks
      //text = text.replace(/<br \/>(\n)*/g, "\n");
    }
    else if (MTools.Browser.IE || MTools.Browser.Opera) {
      // Treat lines with one space as returns
      text = text.replace(/<p>(&nbsp;|&#160;|\s)<\/p>/g, "<p></p>");

      // Line break tags are useless
      text = text.replace(/<br \/>/g, "");

      // Kill all paragraph opens
      text = text.replace(/<p>/g, '');

      // Clean up nonbreaking spaces
      text = text.replace(/&nbsp;/g, '');

      // Paragraphs translate to line breaks
      text = text.replace(/<\/p>(\n)?/g, "\n");

      // Trim off leading and trailing paragraph tags
      // TODO: Removing the following line does not cause any tests to fail
      text = gsub(text, /^<p>/, '');
      // TODO: Removing the following line does not cause any tests to fail
      text = gsub(text, /<\/p>$/, '');
    }

    // bold tag to strong
    // TODO: Removing the following line does not cause any tests to fail
    text = gsub(text, /<b>/, "<strong>");
    // TODO: Removing the following line does not cause any tests to fail
    text = gsub(text, /<\/b>/, "</strong>");

    // italic tag to em
    // TODO: Removing the following line does not cause any tests to fail
    text = gsub(text, /<i>/, "<em>");
    // TODO: Removing the following line does not cause any tests to fail
    text = gsub(text, /<\/i>/, "</em>");

    // Convert double returns into paragraphs
    text = text.replace(/\n\n+/g, "</p>\n\n<p>");

    // Sandwich with p tags
    text = '<p>' + text + '</p>';

	/*  
	// Convert a single return into a line break
    text = gsub(text, /(([^\n])(\n))(?=([^\n]))/, function(match) {
      return match[2] + "<br />\n";
    });
	*/
    // Trim whitespace before and after paragraph tags
    text = text.replace(/<p>\s*/g, "<p>");
    text = text.replace(/\s*<\/p>/g, "</p>");
	
    var element = $('<div></div>');
    element.html(text);

    if (MTools.Browser.WebKit || MTools.Browser.Gecko) {
      var replaced;
      do {
        replaced = false;
        element.find('span').each(function(index) {
          var span = $(this);
          if (span.hasClass('Apple-style-span')) {
            span.removeClass('Apple-style-span');
            if (span[0].className == '')
            span.removeAttr('class');
            replaced = true;
          }
          else if (span.css('fontWeight') == 'bold') {
            span.css('fontWeight',  '');
            if (span.attr('style').length == 0)
            span.removeAttr('style');
            span.html('<strong>' + span.html() + '</strong>');
            replaced = true;
          } 
          else if (span.css('fontStyle') == 'italic') {
            span.css('fontStyle', '');
            if (span.attr('style').length == 0)
            span.removeAttr('style');
            span.html('<em>' + span.html() + '</em>');
            replaced = true;
          }
          else if (span.css('textDecoration') == 'underline') {
            span.css('textDecoration', '');
            if (span.attr('style').length == 0)
            span.removeAttr('style');
            span.html('<u>' + span.html() + '</u>');
            replaced = true;
          }
		  else if (MTools.Browser.WebKit&&span.css('fontSize')) {
            var fontSize = span.css('fontSize');
			span.css('fontSize', '');
			if(fontSize.indexOf('xxx-large') != -1) fontSize = 7;
			else if(fontSize.indexOf('xx-large') != -1) fontSize = 6;
			else if(fontSize.indexOf('x-large') != -1) fontSize = 5;
			else if(fontSize.indexOf('large') != -1) fontSize = 4;
			else if(fontSize.indexOf('medium') != -1) fontSize = 3;
			else if(fontSize.indexOf('x-small') != -1) fontSize = 1;
			else if(fontSize.indexOf('small') != -1) fontSize = 2;
			else if(fontSize == '48px') fontSize = 7;
            if (span.attr('style').length == 0) span.removeAttr('style');
            span.html('<font size="'+fontSize+'">' + span.html() + '</font>');
            replaced = true;
          }
		  else if (MTools.Browser.WebKit&&span.css('color')) {
            var color = span.css('color');
			span.css('color', '');
			if(color.indexOf('rgb') != -1){
				color = color.substring(4, (color.length-1));
				var colors = color.split(', '); 
    			color = '#'+(((parseInt(colors[0]) & 255) << 16) + ((parseInt(colors[1]) & 255) << 8) + parseInt(colors[2])).toString(16);
			}

            if (span.attr('style').length == 0)
            span.removeAttr('style');
            span.html('<font color="'+color+'">' + span.html() + '</font>');
            replaced = true;
          }
		  else if (MTools.Browser.WebKit&&span.css('fontFamily')) {
            var fontFamily = span.css('fontFamily');
			span.css('fontFamily', '');
            if (span.attr('style').length == 0)
            span.removeAttr('style');
            span.html('<font face="'+fontFamily+'">' + span.html() + '</font>');
            replaced = true;
          }
          else if (span[0].attributes.length == 0) {
            span.replaceWith(span.html());
            replaced = true;
          }
        });
		element.find('font').each(function(index) {
          var font = $(this);
          if (font.hasClass('Apple-style-span')) {
            font.removeClass('Apple-style-span');
            if (font[0].className == '')
            font.removeAttr('class');
            replaced = true;
          }
		  if (font[0].attributes.length == 0) {
            font.replaceWith(font.html());
            replaced = true;
          }
		});
      }
      while (replaced);
    }

    // TODO: This should be configurable
    var acceptableBlankTags = ['BR', 'IMG'];

    element.find('*').each(function(index) {
      if (blank(this.innerHTML) && $.inArray(this.nodeName, acceptableBlankTags) < 0 && this.id != 'bookmark') {
        $(this).remove();                 
      }
    });

    text = element.html();
    text = tidyXHTML(text);

	text = text.replace(/<strong><br \/>(\n)*<\/strong>/g, "<br />");
	text = text.replace(/<em><br \/>(\n)*<\/em>/g, "<br />");
	text = text.replace(/<u><br \/>(\n)*<\/u>/g, "<br />");

    // Normalize whitespace after linebreaks and between paragraphs
    text = text.replace(/<br \/>(\n)*/g, "<br />\n");
    text = text.replace(/<\/p>\n<p>/g, "</p>\n\n<p>");

    // Cleanup empty paragraphs
    text = text.replace(/<p>\s*<\/p>/g, "");

    // Trim whitespace at the end
    text = text.replace(/\s*$/g, "");

    return text;
  };

  /**
  *  Convert clean html to something browsers can edit
  *
  *  This function preforms the reserve function of `String#formatHTMLOutput`. Each
  *  browser has difficulty editing mix formatting conventions. This restores
  *  most of the original browser specific formatting tags and some other
  *  styling conventions.
  *
  *  Textarea => dirty() => Raw content
  **/
  var dirty = function(text) {
	
    var element = $('<div></div>');
    element.html(text);
	
    if (MTools.Browser.WebKit) {
      // Convert style spans back
      $(element).find('strong').each(function(index) {
        $(this).replaceWith('<span style="font-weight: bold;">' + this.innerHTML + '</span>');
      });
      $(element).find('em').each(function(index) {
        $(this).replaceWith('<span style="font-style: italic;">' + this.innerHTML + '</span>');
      });
      $(element).find('u').each(function(index) {
        $(this).replaceWith('<span style="text-decoration: underline;">' + this.innerHTML + '</span>');
      });
    }
	if (MTools.Browser.Gecko) {
      // Convert style spans back
      $(element).find('strong').each(function(index) {
        $(this).replaceWith('<b>' + this.innerHTML + '</b>');
      });
      $(element).find('em').each(function(index) {
        $(this).replaceWith('<i>' + this.innerHTML + '</i>');
      });
    }

    // TODO: Test if WebKit has issues editing spans without
    // "Apple-style-span". If not, remove this.
    if (MTools.Browser.WebKit) {
      element.find('span').each(function(index) {
        var span = $(this);
        if (span.css('fontWeight') == 'bold')
        span.addClass('Apple-style-span');

        if (span.css('fontStyle') == 'italic')
        span.addClass('Apple-style-span');

        if (span.css('textDecoration') == 'underline')
        span.addClass('Apple-style-span');
      });            
    }

    text = element.html();
    text = tidyXHTML(text);

    // Convert paragraphs into double returns
    text = text.replace(/<\/p>(\n)*<p>/g, "\n\n");

    // Convert line breaks into single returns
    text = text.replace(/(\n)?<br( \/)?>(\n)?/g, "\n");

    // Chop off leading and trailing paragraph tags
    text = text.replace(/^<p>/g, '');
    text = text.replace(/<\/p>$/g, '');

    if (MTools.Browser.Gecko) {
      // Replace returns with line break tags
      text = text.replace(/\n/g, "<br>");
      //text = text + '<br>';
    }
    else if (MTools.Browser.WebKit) {
      // Wrap lines in div tags
      text = text.replace(/\n/g, "</div><div>");
      text = '<div>' + text + '</div>';
      text = text.replace(/<div><\/div>/g, "<div><br /></div>");
    }
    else if (MTools.Browser.IE || MTools.Browser.Opera) {
      text = text.replace(/\n/g, "</p>\n<p>");
      text = '<p>' + text + '</p>';
      text = text.replace(/<p><\/p>/g, "<p>&nbsp;</p>");
      text = text.replace(/(<p>&nbsp;<\/p>)+$/g, "");
    }

    return text;
  }

  $.fn.webdocHTML = { //TODO: improve this namespace
    tidyXHTML: tidyXHTML,
    clean: clean,
    dirty: dirty,
    gsub: gsub
  };
})(jQuery);

