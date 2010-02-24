require 'spec_helper'

describe Document do
  should_be_built_by_factory
  should_be_created_by_factory
  should_have_many :pages, :order => 'position ASC', :dependent => :destroy
  
  describe "default" do
    subject { Factory(:document) }
    
    its(:pages) { should be_present }
    
    it "should have creator as owner on create" do
      subject.creator.has_role?("owner").should be_true
    end
  end
  
  describe "accesses creation" do
    subject { Factory(:document) }
    
    it "should add user as editor" do
      user = Factory(:user)
      subject.create_accesses({ :editors => [user.email], :readers => [] }.to_json)
      user.has_role?("editor", subject).should be_true
    end
    
    it "should add user as reader" do
      user = Factory(:user)
      subject.create_accesses({ :editors => [], :readers => [user.email] }.to_json)
      accesses = subject.to_access_json
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
#

