// Angie Radtke 2009 //

/*global window, $, localStorage, Cookie, altopen, altclose, big, small, rightopen, rightclose, bildauf, bildzu */

//Storeage functions
function supportsLocalStorage() {
	return ('localStorage' in window) && window.localStorage !== null;
}

function saveIt(name) {
	var x = jQuery(name).style.display;

	if (!x) {
		alert('No cookie available');
	} else {
		if (supportsLocalStorage()) {
			localStorage[name] = x;
		} else {
			Cookie.write(name, x, {duration: 7});
		}
	}
}

function readIt(name) {
	if (supportsLocalStorage()) {
		return localStorage[name];
	} else {
		return Cookie.read(name);
	}
}

function wrapperwidth(width) {
	jQuery('wrapper').setStyle('width', width);
}

// add Wai-Aria landmark-roles
window.addEvent('domready', function () {
	
	if (jQuery('nav')) {
		jQuery('nav').setProperties( {
			role : 'navigation'
		});
	}
	
	if (jQuery('breadcrumbs')) {
		jQuery('breadcrumbs').setProperties( {
			role : 'breadcrumbs'
		});
	}

	if (jQuery('mod-search-searchword')) {
		jQuery('mod-search-searchword').form.setProperties( {
			role : 'search'
		});
	}

	if (jQuery('main')) {
		jQuery('main').setProperties( {
			role : 'main'
		});
	}

	if (jQuery('right')) {
		jQuery('right').setProperties( {
			role : 'contentinfo'
		});
	}
	
});

window.addEvent('domready', function() {

	// get ankers
		var myankers = jQuery(document.body).getElements('a.opencloselink');
		myankers.each(function(element) {
			jQuery(element).setProperty('role', 'tab');
			var myid = jQuery(element).getProperty('id');
			myid = myid.split('_');
			myid = 'module_' + myid[1];
			jQuery(element).setProperty('aria-controls', myid);
		});

		var list = jQuery(document.body).getElements('div.moduletable_js');
		list.each(function(element) {

			if (jQuery(element).getElement('div.module_content')) {

				var el = jQuery(element).getElement('div.module_content');
				jQuery(el).setProperty('role', 'tabpanel');
				var myid = jQuery(el).getProperty('id');
				myid = myid.split('_');
				myid = 'link_' + myid[1];
				jQuery(el).setProperty('aria-labelledby', myid);
				var myclass = el.get('class');
				var one = myclass.split(' ');
				// search for active menu-item
				var listelement = el.getElement('a.active');
				var unique = el.id;
				var nocookieset = readIt(unique);
				if ((listelement) ||
						((one[1] == 'open') && (nocookieset == null))) {
					el.setStyle('display', 'block');
					var eltern = el.getParent();
					var elternh = eltern.getElement('h3');
					var elternbild = eltern.getElement('img');
					elternbild.setProperties( {
						alt : altopen,
						src : bildzu
					});
					elternbild.focus();
				} else {
					el.setStyle('display', 'none');
					el.setProperty('aria-expanded', 'false');
				}

				unique = el.id;
				var cookieset = readIt(unique);
				if (cookieset == 'block') {
					el.setStyle('display', 'block');
					el.setProperty('aria-expanded', 'true');
				}

			}
		});
	});

window.addEvent('domready', function() {
	var what = jQuery('right');
	// if rightcolumn
		if (what != null) {
			var whatid = what.id;
			var rightcookie = readIt(whatid);
			if (rightcookie == 'none') {
				what.setStyle('display', 'none');
				jQuery('nav').addClass('leftbigger');
				wrapperwidth(big);
				var grafik = jQuery('bild');
				jQuery('bild').innerHTML = rightopen;
				grafik.focus();
			}
		}
	});

function auf(key) {
	var el = jQuery(key);

	if (el.style.display == 'none') {
		el.setStyle('display', 'block');
		el.setProperty('aria-expanded', 'true');

		if (key != 'right') {
			el.slide('hide').slide('in');
			el.getParent().setProperty('class', 'slide');
			eltern = el.getParent().getParent();
			elternh = eltern.getElement('h3');
			elternh.addClass('high');
			elternbild = eltern.getElement('img');
			// elternbild.focus();
			el.focus();
			elternbild.setProperties( {
				alt : altopen,
				src : bildzu
			});
		}

		if (key == 'right') {
			document.getElementById('right').setStyle('display', 'block');
			wrapperwidth(small);
			jQuery('nav').removeClass('leftbigger');
			grafik = jQuery('bild');
			jQuery('bild').innerHTML = rightclose;
			grafik.focus();
		}
	} else {
		el.setStyle('display', 'none');
		el.setProperty('aria-expanded', 'false');

		el.removeClass('open');

		if (key != 'right') {
			eltern = el.getParent().getParent();
			elternh = eltern.getElement('h3');
			elternh.removeClass('high');
			elternbild = eltern.getElement('img');
			// alert(bildauf);
			elternbild.setProperties( {
				alt : altclose,
				src : bildauf
			});
			elternbild.focus();
		}

		if (key == 'right') {
			document.getElementById('right').setStyle('display', 'none');
			wrapperwidth(big);
			jQuery('nav').addClass('leftbigger');
			grafik = jQuery('bild');
			jQuery('bild').innerHTML = rightopen;
			grafik.focus();
		}
	}
	// write cookie
	saveIt(key);
}

// ########### Tabfunctions ####################

window.addEvent('domready', function() {
	var alldivs = jQuery(document.body).getElements('div.tabcontent');
	var outerdivs = jQuery(document.body).getElements('div.tabouter');
	outerdivs = outerdivs.getProperty('id');

	for (var i = 0; i < outerdivs.length; i++) {
		alldivs = jQuery(outerdivs[i]).getElements('div.tabcontent');
		count = 0;
		alldivs.each(function(element) {
			count++;
			jQuery(element).setProperty('role', 'tabpanel');
			jQuery(element).setProperty('aria-hidden', 'false');
			jQuery(element).setProperty('aria-expanded', 'true');
			elid = jQuery(element).getProperty('id');
			elid = elid.split('_');
			elid = 'link_' + elid[1];
			jQuery(element).setProperty('aria-labelledby', elid);

			if (count != 1) {
				jQuery(element).addClass('tabclosed').removeClass('tabopen');
				jQuery(element).setProperty('aria-hidden', 'true');
				jQuery(element).setProperty('aria-expanded', 'false');
			}
		});

		countankers = 0;
		allankers = jQuery(outerdivs[i]).getElement('ul.tabs').getElements('a');

		allankers.each(function(element) {
			countankers++;
			jQuery(element).setProperty('aria-selected', 'true');
			jQuery(element).setProperty('role', 'tab');
			linkid = jQuery(element).getProperty('id');
			moduleid = linkid.split('_');
			moduleid = 'module_' + moduleid[1];
			jQuery(element).setProperty('aria-controls', moduleid);

			if (countankers != 1) {
				jQuery(element).addClass('linkclosed').removeClass('linkopen');
				jQuery(element).setProperty('aria-selected', 'false');
			}
		});
	}
});

function tabshow(el) {
	var outerdiv = jQuery(el).getParent();
	outerdiv = outerdiv.getProperty('id');

	var alldivs = jQuery(outerdiv).getElements('div.tabcontent');
	var liste = jQuery(outerdiv).getElement('ul.tabs');

	jQuery(liste).getElements('a').setProperty('aria-selected', 'false');

	alldivs.each(function(element) {
		jQuery(element).addClass('tabclosed').removeClass('tabopen');
		jQuery(element).setProperty('aria-hidden', 'true');
		jQuery(element).setProperty('aria-expanded', 'false');
	});

	jQuery(el).addClass('tabopen').removeClass('tabclosed');
	jQuery(el).setProperty('aria-hidden', 'false');
	jQuery(el).setProperty('aria-expanded', 'true');
	jQuery(el).focus();
	var getid = el.split('_');
	var activelink = 'link_' + getid[1];
	jQuery(activelink).setProperty('aria-selected', 'true');
	jQuery(liste).getElements('a').addClass('linkclosed').removeClass('linkopen');
	jQuery(activelink).addClass('linkopen').removeClass('linkclosed');
}

function nexttab(el) {
	var outerdiv = jQuery(el).getParent();
	var liste = jQuery(outerdiv).getElement('ul.tabs');
	var getid = el.split('_');
	var activelink = 'link_' + getid[1];
	var aktiverlink = jQuery(activelink).getProperty('aria-selected');
	var tablinks = jQuery(liste).getElements('a').getProperty('id');

	for ( var i = 0; i < tablinks.length; i++) {

		if (tablinks[i] == activelink) {

			if (jQuery(tablinks[i + 1]) != null) {
				jQuery(tablinks[i + 1]).onclick();
				break;
			}
		}
	}
}
