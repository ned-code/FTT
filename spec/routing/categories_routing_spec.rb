require 'spec_helper'

describe CategoriesController do
  
  should_route :get,    '/categories',    :action => :index
  
end
