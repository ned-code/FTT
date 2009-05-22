require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe PasswordResetsController do

  it { should route(:get,     '/session/password_reset/new',    :controller => :password_resets, :action => :new     )}
  it { should route(:post,    '/session/password_reset',        :controller => :password_resets, :action => :create  )}

end
