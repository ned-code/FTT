require 'spec_helper'

describe Document do
  should_be_built_by_factory
  should_be_created_by_factory
  should_have_many :pages, :order => 'position ASC', :dependent => :destroy
  
  describe "default" do
    subject { Factory(:document) }
    
    its(:pages) { should be_present }
    
    it "should have creator as editor on create" do
      subject.creator.has_role?("editor").should be_true
    end
  end
  
  describe "accesses creation" do
    subject { Factory(:document) }
    
    it "should add user as editor (using create_accesses method)" do
      user = Factory(:user)
      subject.create_accesses({ :editors => [user.email], :readers => [], :editorsMessage => "Dummy", :readersMessage => "Dummy" }.to_json)
      user.has_role?("editor", subject).should be_true
    end
    
    it "should add user as reader (using create_accesses method)" do
      user = Factory(:user)
      subject.create_accesses({ :editors => [], :readers => [user.email], :editorsMessage => "Dummy", :readersMessage => "Dummy" }.to_json)
      accesses = subject.to_access_json
      user.has_role?("reader", subject).should be_true
    end
    
    it "should add user as editor" do
      user = Factory(:user)
      subject.create_role_for_users({ :role => "editor", :recipients => [user.email, "test@mnemis.com"], :message => "Dummy" }.to_json)
      subject.to_user_for_this_role_json("editor")
      user.has_role?("editor", subject).should be_true
    end
    
    it "should add user as reader" do
      user = Factory(:user)
      subject.create_role_for_users({ :role => "reader", :recipients => [user.email, "test@mnemis.com"], :message => "Dummy" }.to_json)
      subject.to_user_for_this_role_json("reader")
      user.has_role?("reader", subject).should be_true
    end
    
  end
  
  describe "accesses update" do
    subject { Factory(:document) }
    
    it "should change user role from reader to editor" do
      user = Factory(:user)
      user.has_role!("reader", subject)
      subject.update_accesses({ :editors => [user.id], :readers => [] }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_role?("editor", subject).should be_true
    end
    
    it "should change user role from editor to reader" do
      user = Factory(:user)
      user.has_role!("editor", subject)
      subject.update_accesses({ :editors => [], :readers => [user.id] }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_role?("reader", subject).should be_true
    end
    
    it "should change user role from editor to nothing" do
      user = Factory(:user)
      user.has_role!("editor", subject)
      subject.update_accesses({ :editors => [], :readers => [] }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "should change user role from reader to nothing" do
      user = Factory(:user)
      user.has_role!("reader", subject)
      subject.update_accesses({ :editors => [], :readers => [] }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "should still have roles for user after multiple updates" do
      user = Factory(:user)
      user.has_role!("editor", subject)
      subject.update_accesses({ :editors => [user.id], :readers => [] }.to_json)
      user.has_role?("editor", subject).should be_true
      user.has_roles_for?(subject).should be_true
    end
  end
  
  describe "accesses suppression" do
    subject { Factory(:document) }
    
    it "should remove editor role" do
      user = Factory(:user)
      user.has_role!("editor", subject)
      subject.remove_role({ :role => "editor", :user_id => user.id }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "should remove reader role" do
      user = Factory(:user)
      user.has_role!("reader", subject)
      subject.remove_role({ :role => "reader", :user_id => user.id }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "sould remove editor role but keep other roles" do
      user = Factory(:user)
      user.has_role!("editor", subject)
      user.has_role!("reader", subject)
      subject.remove_role({ :role => "editor", :user_id => user.id }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_roles_for?(subject).should be_true
    end
    
    it "sould remove reader role but keep other roles" do
      user = Factory(:user)
      user.has_role!("editor", subject)
      user.has_role!("reader", subject)
      subject.remove_role({ :role => "reader", :user_id => user.id }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_roles_for?(subject).should be_true
    end
  end
  
end

# == Schema Information
#
# Table name: documents
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  title       :string(255)
#  deleted_at  :datetime
#  created_at  :datetime
#  updated_at  :datetime
#  description :text
#  size        :text
#  category_id :integer
#  creator_id  :integer
#  is_public   :boolean         default(FALSE)
#

