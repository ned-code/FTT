// card.js
//
// Stephen
//
// Manages ajax calls and state change animations for cards


// TODO: move Application errors to somewhere sensible
WebDoc.Application.errors = {};
  
WebDoc.Application.errors.ajaxError = function makeError(status, error) {
  return jQuery('<p/>').html("Hmmm. We haven't been able to do that. Sorry. The error is:")
  .add( jQuery('<h4/>').html( status ) )
  .add( jQuery('<p/>').html( error ) );
};


WebDoc.Application.beforeMain('card', function(){
  var cards = jQuery(".card");
  
  cards.find(".card-name").truncate();
  cards.find(".card-bio").truncate({ match: '<br/><br/>' });
  
  cards.each(function(i){
    var card = jQuery(this),
        data = {
          user: {
            id: card.attr('data-webdoc-user-id')
          }
        };
    
    card.data('webdoc', data);
  });
    
  jQuery(document)
  //Listen to follow link
  .delegate(".card a[href='#subscribe']:not(.loading)", "click", function(e){
    var button = jQuery(e.currentTarget),
        card = button.closest('.card'),
        data = {
          following_id: card.data('webdoc').user.id
        };
    
    function callback(json) {
      button
      .removeClass('loading')
      .href('#unsubscribe')
      .html('unfollow');
      
      card.trigger('follow');
    }
    
    function errorback(request, status, error) {
      button.removeClass('loading');
      card.trigger('error');

      WebDoc.Application.errors.ajaxError(status, error).flash();
    }
    
    //Google analytics
    if (window._gaq) {
      var document_uuid = null;
      if (WebDoc.application && WebDoc.application.pageEditor) {
        document_uuid = WebDoc.application.pageEditor.currentDocument.uuid();
      }
      _gaq.push(['_trackEvent', 'follow', 'follow', document_uuid]);
    }
    jQuery.ajax({
      url: "/followships/follow",
      type: 'POST',
      data: data, 
      dataType: 'json',              
      success: callback,
      error: errorback
    });
    
    button.addClass('loading');
    
    e.preventDefault();
  })
  //listen to unfollow link
  .delegate(".card a[href='#unsubscribe']:not(.loading)", "click", function(e){
    var button = jQuery(e.currentTarget),
        card = button.closest('.card'),
        data = {
          following_id: card.data('webdoc').user.id
        };
    
    function callback(json) {
      button
      .removeClass('loading')
      .href('#subscribe')
      .html('follow');
      
      card.trigger('unfollow');
    }
    
    function errorback(request, status, error) {
      button.removeClass('loading');
      card.trigger('error');

      WebDoc.Application.errors.ajaxError(status, error).flash();
    }
    
    jQuery.ajax({
      url: "/followships/unfollow",
      type: 'DELETE',
      data: data, 
      dataType: 'json',              
      success: callback,
      error: errorback
    });
    
    button.addClass('loading');
    
    e.preventDefault();
  })
  //listen to become friend link
  .delegate(".card a[href='#become_friend']:not(.loading)", "click", function(e){
    var button = jQuery(e.currentTarget),
        card = button.closest('.card'),
        data = {
          friend_id: card.data('webdoc').user.id
        };
    function callback(json) {
      button
      .removeClass('loading')
      .href('#cancel_friend_request')
      .html('Cancel Friend Request');
      
      card.trigger('become_friend');
    }
    
    function errorback(request, status, error) {
      button.removeClass('loading');
      card.trigger('error');

      WebDoc.Application.errors.ajaxError(status, error).flash();
    }
    
    jQuery.ajax({
      url: "/friendships/become_friend",
      type: 'post',
      data: data, 
      dataType: 'json',              
      success: callback,
      error: errorback
    });
    
    button.addClass('loading');
    
    e.preventDefault();
  })
  //listen to cancel friend request link
  .delegate(".card a[href='#cancel_friend_request']:not(.loading)", "click", function(e){
    var button = jQuery(e.currentTarget),
        card = button.closest('.card'),
        data = {
          friend_id: card.data('webdoc').user.id
        };
    function callback(json) {
      button
      .removeClass('loading')
      .href('#become_friend')
      .html('Become Friend');
      
      card.trigger('cancel_friend_request');
    }
    
    function errorback(request, status, error) {
      button.removeClass('loading');
      card.trigger('error');

      WebDoc.Application.errors.ajaxError(status, error).flash();
    }
    
    jQuery.ajax({
      url: "/friendships/cancel_request",
      type: 'post',
      data: data, 
      dataType: 'json',              
      success: callback,
      error: errorback
    });
    
    button.addClass('loading');
    
    e.preventDefault();
  })
  //listen to accept friend request link
  .delegate(".card a[href='#accept_friend_request']:not(.loading)", "click", function(e){
    var button = jQuery(e.currentTarget),
        card = button.closest('.card'),
        data = {
          friend_id: card.data('webdoc').user.id
        };
    function callback(json) {
      button.removeClass('loading');
      jQuery('#friend_request_'+data.friend_id).html('You are now friends');
      card.trigger('accept_friend_request');
    }
    
    function errorback(request, status, error) {
      button.removeClass('loading');
      card.trigger('error');

      WebDoc.Application.errors.ajaxError(status, error).flash();
    }
    
    jQuery.ajax({
      url: "/friendships/accept",
      type: 'post',
      data: data, 
      dataType: 'json',              
      success: callback,
      error: errorback
    });
    
    button.addClass('loading');
    
    e.preventDefault();
  })
  //listen to reject friend request link
  .delegate(".card a[href='#reject_friend_request']:not(.loading)", "click", function(e){
    var button = jQuery(e.currentTarget),
        card = button.closest('.card'),
        data = {
          friend_id: card.data('webdoc').user.id
        };
    function callback(json) {
      button.removeClass('loading');
      jQuery('#friend_request_'+data.friend_id)
      .html('<a class="become_friend_button button" href="#become_friend">Become Friend</a>')
      card.trigger('accept_friend_request');
    }
    
    function errorback(request, status, error) {
      button.removeClass('loading');
      card.trigger('reject_friend_request');

      WebDoc.Application.errors.ajaxError(status, error).flash();
    }
    
    jQuery.ajax({
      url: "/friendships/reject",
      type: 'post',
      data: data, 
      dataType: 'json',              
      success: callback,
      error: errorback
    });
    
    button.addClass('loading');
    
    e.preventDefault();
  })
  //listen to cancel friendship link
  .delegate(".card a[href='#cancel_friendship']:not(.loading)", "click", function(e){
    var button = jQuery(e.currentTarget),
        card = button.closest('.card'),
        data = {
          friend_id: card.data('webdoc').user.id
        };
    function callback(json) {
      button
      .removeClass('loading')
      .removeClass('red')
      .addClass('green')
      .href('#become_friend')
      .html('Become Friend');
    }
    
    function errorback(request, status, error) {
      button.removeClass('loading');
      card.trigger('cancel_friendship');

      WebDoc.Application.errors.ajaxError(status, error).flash();
    }
    
    jQuery.ajax({
      url: "/friendships/revoke",
      type: 'post',
      data: data, 
      dataType: 'json',              
      success: callback,
      error: errorback
    });
    
    button.addClass('loading');
    
    e.preventDefault();
  });
});
