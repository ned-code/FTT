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
  });
});
