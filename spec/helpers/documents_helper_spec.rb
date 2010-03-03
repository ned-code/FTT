require 'spec_helper'

describe DocumentsHelper do
  
  describe "edit_mode?" do
    
    before(:each) do
      @document = mock_model(Document)
      helper.instance_variable_set(:@document, @document)
    end
    
    it "should be true if current_user is admin" do
      user = mock_model(User)
      user.stub(:has_role?).with("admin").and_return(true)
      helper.stub(:current_user).and_return(user)
      
      helper.edit_mode?.should be_true
    end
    
    it "should be true if current_user is not admin but editor of document" do
      user = mock_model(User)
      user.stub(:has_role?).with("admin").and_return(false)
      user.stub(:has_role?).with("editor", @document).and_return(true)
      helper.stub(:current_user).and_return(user)
      
      helper.edit_mode?.should be_true
    end
    
    it "should be false if current_user is not admin and not editor of document" do
      user = mock_model(User)
      user.stub(:has_role?).with("admin").and_return(false)
      user.stub(:has_role?).with("editor", @document).and_return(false)
      helper.stub(:current_user).and_return(user)
      
      helper.edit_mode?.should be_false
    end
    
    it "should be false if there is not current_user" do
      helper.stub(:current_user).and_return(nil)
      
      helper.edit_mode?.should be_false
    end
    
  end
  
end