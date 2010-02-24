require 'spec_helper'

require 'spec_helper'

describe Admin::WidgetsController do
  include Devise::TestHelpers
  
  context 'accessed by admin user' do
    
    before(:each) { sign_in :user, Factory.create(:admin) }
    
    describe :get => :index do
      should_respond_with :success, :content_type => :html
    end
    
    describe :get => :new do
      should_respond_with :success, :content_type => :html
    end
    
  end
  
  context 'accessed by basic user' do
    
    before(:each) { sign_in :user, Factory.create(:user) }
    
    describe :get => :index do
      should_not_respond_with :success, :content_type => :html
    end
    
    describe :get => :new do
      should_not_respond_with :success, :content_type => :html
    end
    
  end
  
end