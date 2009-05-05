require File.expand_path(File.dirname(__FILE__) + '<%= '/..' * class_nesting_depth %>/../spec_helper')

describe <%= class_name %>Controller do

  it { should route :get,     '/<%= plural_name %>',    :controller => :<%= plural_name %>, :action => :index             }
  it { should route :post,    '/<%= plural_name %>',    :controller => :<%= plural_name %>, :action => :create            }
  it { should route :get,     '/<%= plural_name %>/1',  :controller => :<%= plural_name %>, :action => :show,    :id => 1 }
  it { should route :put,     '/<%= plural_name %>/1',  :controller => :<%= plural_name %>, :action => :update,  :id => 1 }
  it { should route :delete,  '/<%= plural_name %>/1',  :controller => :<%= plural_name %>, :action => :destroy, :id => 1 }

end
