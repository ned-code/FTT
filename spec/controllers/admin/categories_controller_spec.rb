require 'spec_helper'

describe Admin::CategoriesController do
  include Devise::TestHelpers
  
  context 'accessed by admin' do
    
    before(:each) { sign_in :user, Factory(:admin) }
    
    describe :get => :index do
      should_respond_with :success, :content_type => :html
    end
    
    describe :get => :new do
      should_respond_with :success, :content_type => :html
    end
    
  end
  
  context 'accessed by user' do
    
    before(:each) { sign_in :user, Factory(:user) }
    
    describe :get => :index do
      should_not_respond_with :success, :content_type => :html
    end
    
    describe :get => :new do
      should_not_respond_with :success, :content_type => :html
    end
    
  end
  
end