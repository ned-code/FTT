/*
Backbone.sync = function(method, model, options) {
  var
    key = method + ':' + _.result(model, 'url'),
    methods = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
    },
  params;

  params = _.extend({
    type: methods[method],
    dataType: 'json'
  }, options || {});

  if(!options.url) {
    params.url = _.result(model, 'url') || console.log('url error');
  }

  if(!options.attrs && model.convert) {
    options.attrs = model.convert(model.toJSON());
  }

  if(options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
    params.contentType = 'application/json';
    params.data = JSON.stringify(options.attrs || model.toJSON(options));
  }
  if(method !== 'read') {
    params.processData = false;
  }

  if($.isFunction(options.before)) {
    params.beforeSend = options.before;
  }

  // Make the request, allowing the user to override any Ajax options.
  var xhr = options.xhr = Backbone.ajax(params);
  model.trigger('request', model, xhr, options);
  return xhr;
};
*/

