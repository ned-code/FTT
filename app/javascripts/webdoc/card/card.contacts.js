// card.contacts.js
//
// Extends card.js
//
// Provides animations for adding and removing cards from contact lists
// on the contacts page.

(function(undefined){

var contacts, contactscount, followers;

function insertIntoContacts(e) {
	var card = jQuery(e.currentTarget),
	  	item = card.closest('li'),
	  	children = contacts.children(),
	  	clone = item.clone(true),
	  	newCard = clone.find('.card'),
	  	height = item.height(),
	  	margin = item.css('marginBottom'),
	  	fromObj = { n: 0 },
	  	toObj = { n: 1 },
	  	marker, offset;
	
	function step(n){
		clone.css({
			height: height*n,
			marginBottom: margin * n,
			opacity: n
		});
		newCard.css({
			left: 384 - n*384,
			top: offset && offset - n*offset
		});
	}
	
	function callback() {
		newCard.css({ position: '' });
		contacts.trigger('update');
	}
	
	clone.css({
		height: 0,
		opacity: 0
	})
	
	marker = children.eq( item.index() );
	
	if ( marker.length ) {
		marker.before( clone );
	}
	else {
		contacts.append( clone );
		offset = item.offset().top - clone.offset().top;
	}
	
	newCard.css({ position: 'relative' });
	
	jQuery( fromObj ).animate( toObj, {
	  duration: 500,
	  step: step,
	  complete: callback
	});
	
	card.find('.subscribe-button').remove();
}

function removeFromContacts(e) {
	var card = jQuery(e.currentTarget),
			data = card.data('webdoc'),
			item = card.closest('li'),
			height = item.height(),
			margin = item.css('marginBottom'),
			fromObj = { n: 1 },
			toObj = { n: 0 },
			dir = -1,
			fCard, fOff;
	
	function step(n){
		item.css({
			height: height * n,
			marginBottom: margin * n,
			opacity: n
		});
		card.css({
			left: dir * ( 384 - n * 384 ),
			top: ( fOff !== undefined ) ? fOff - n * fOff : undefined
		});
	}
	
	function callback() {
		item.remove();
		contacts.trigger('update');
	}
	
	// Find out if the removed card is one of the followers
	followers
	.find('.card')
	.each(function(){
		var followerCard = jQuery(this),
				followerData = followerCard.data('webdoc'),
				link, offset, fOffset;
		
		// If it is...
		if ( followerData.user.id === data.user.id ) {
			dir = 1;
			link = jQuery('<a/>', { href: '#subscribe', 'class': 'subscribe-button button' }).html("follow");
			
			offset = card.offset();
			fOffset = followerCard.offset();
			
			fOff = fOffset.top - offset.top;
			
			followerCard.append( link );
			// ...stop iterating
			return false;
		}
	});
	
	jQuery(fromObj)
	.animate( toObj, {
		duration: 500,
		step: step,
		complete: callback
	})
}

function makeUpdateCount( listNode, countNode ) {
	return function(e) {
		var items = listNode.find('.card');
		countNode.html( items.length );
		return;
	};
}

jQuery(document).ready(function(){
	contacts = jQuery('#contacts'),
	contactscount = jQuery('#contactscount'),
	followers = jQuery('#followers');
	
	followers
	.delegate('.card', 'follow', insertIntoContacts);
	
	contacts
	.delegate('.card', 'unfollow', removeFromContacts)
	.bind('update', makeUpdateCount( contacts, contactscount ));
});

})();