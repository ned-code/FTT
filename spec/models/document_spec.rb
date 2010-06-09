require 'spec_helper'

describe Document do
  
  should_allow_mass_assignment_of :uuid, :title, :description, :size, :category_id, :is_public
  should_not_allow_mass_assignment_of :id, :creator_id, :deleted_at, :created_at, :updated_at
  
  should_be_built_by_factory
  should_be_created_by_factory
  should_have_many :pages, :order => 'position ASC', :dependent => :destroy
  should_belong_to :category
  
  describe "default" do
    subject { Factory(:document) }
    
    its(:pages) { should be_present }
    
    it "should have creator as editor on create" do
      subject.creator.has_role?("editor").should be_true
    end
    
    it "should be possible to create document with % size unit" do
      created_doc = Document.create({ :title => "test", :size => { :width => "100%", :height => "100%"}})
      created_doc.pages.length.should == 1
      created_doc.pages[0].data[:css][:width].should == "100%"
      created_doc.pages[0].data[:css][:height].should == "100%"
    end
    it "should be possible to create document with px size unit" do
      created_doc = Document.create({ :title => "test", :size => { :width => "120px", :height => "500px"}})
      created_doc.pages.length.should == 1
      created_doc.pages[0].data[:css][:width].should == "120px"
      created_doc.pages[0].data[:css][:height].should == "500px"
    end    
    it "should be possible to create document with no size unit => px must be used" do
      created_doc = Document.create({ :title => "test", :size => { :width => "300", :height => "200"}})
      created_doc.pages.length.should == 1
      created_doc.pages[0].data[:css][:width].should == "300px"
      created_doc.pages[0].data[:css][:height].should == "200px"
    end        
  end
  
  describe "accesses creation" do
    subject { Factory(:document) }
    
    it "should add user as editor (using create_accesses method)" do
      user = Factory(:user)
      current_user = Factory(:user)
      subject.create_accesses(current_user, { :editors => [user.email], :readers => [], :editorsMessage => "Dummy", :readersMessage => "Dummy" }.to_json)
      user.has_role?("editor", subject).should be_true
    end
    
    it "should add user as reader (using create_accesses method)" do
      user = Factory(:user)
      current_user = Factory(:user)
      subject.create_accesses(current_user, { :editors => [], :readers => [user.email], :editorsMessage => "Dummy", :readersMessage => "Dummy" }.to_json)
      accesses = subject.to_access_json
      user.has_role?("reader", subject).should be_true
    end
    
    it "should add user as editor" do
      user = Factory(:user)
      current_user = Factory(:user)
      subject.create_role_for_users(current_user, { :role => "editor", :recipients => [user.email, "test@mnemis.com"], :message => "Dummy" }.to_json)
      subject.to_user_for_this_role_json("editor")
      user.has_role?("editor", subject).should be_true
    end
    
    it "should add user as reader" do
      user = Factory(:user)
      current_user = Factory(:user)
      subject.create_role_for_users(current_user, { :role => "reader", :recipients => [user.email, "test@mnemis.com"], :message => "Dummy" }.to_json)
      subject.to_user_for_this_role_json("reader")
      user.has_role?("reader", subject).should be_true
    end
    
  end
  
  describe "accesses update" do
    subject { Factory(:document) }
    
    it "should change user role from reader to editor" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("reader", subject)
      subject.update_accesses(current_user, { :editors => [user.id], :readers => [] }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_role?("editor", subject).should be_true
    end
    
    it "should change user role from editor to reader" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("editor", subject)
      subject.update_accesses(current_user, { :editors => [], :readers => [user.id] }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_role?("reader", subject).should be_true
    end
    
    it "should change user role from editor to nothing" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("editor", subject)
      subject.update_accesses(current_user, { :editors => [], :readers => [] }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "should change user role from reader to nothing" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("reader", subject)
      subject.update_accesses(current_user, { :editors => [], :readers => [] }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "should still have roles for user after multiple updates" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("editor", subject)
      subject.update_accesses(current_user, { :editors => [user.id], :readers => [] }.to_json)
      user.has_role?("editor", subject).should be_true
      user.has_roles_for?(subject).should be_true
    end
  end
  
  describe "accesses suppression" do
    subject { Factory(:document) }
    
    it "should remove editor role" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("editor", subject)
      subject.remove_role(current_user, { :role => "editor", :user_id => user.id }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "should remove reader role" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("reader", subject)
      subject.remove_role(current_user, { :role => "reader", :user_id => user.id }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_roles_for?(subject).should be_false
    end
    
    it "sould remove editor role but keep other roles" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("editor", subject)
      user.has_role!("reader", subject)
      subject.remove_role(current_user, { :role => "editor", :user_id => user.id }.to_json)
      user.has_role?("editor", subject).should be_false
      user.has_roles_for?(subject).should be_true
    end
    
    it "sould remove reader role but keep other roles" do
      user = Factory(:user)
      current_user = Factory(:user)
      user.has_role!("editor", subject)
      user.has_role!("reader", subject)
      subject.remove_role(current_user, { :role => "reader", :user_id => user.id }.to_json)
      user.has_role?("reader", subject).should be_false
      user.has_roles_for?(subject).should be_true
    end
  end

  describe "all_with_explore_params" do
    before do
      @user = Factory(:user)
      now = Time.now

      @cat1 = Factory(:category)
      @cat2 = Factory(:category)

      @doc1 = Factory(:document, :creator => @user, :created_at => now-90.minutes, :updated_at => now-60.minutes, :views_count => 300, :category_id => @cat1.id)
      @doc2 = Factory(:document, :creator => @user, :created_at => now-80.minutes, :updated_at => now-58.minutes, :views_count => 100, :category_id => @cat1.id)
      @doc3 = Factory(:document, :creator => @user, :created_at => now-70.minutes, :updated_at => now-56.minutes, :views_count => 250, :category_id => @cat2.id)
      @doc4 = Factory(:document, :creator => @user, :created_at => now-60.minutes, :updated_at => now-54.minutes, :is_public => false, :category_id => @cat2.id)
    end

    it "should return the most recent public documents when he han't params" do
      docs = Document.all_public_paginated_with_explore_params()
      docs.should == [@doc3, @doc2, @doc1]
    end

    it "should return the most recent public documents when the params order_string equals 'recent'" do
      docs = Document.all_public_paginated_with_explore_params('recent')
      docs.should == [@doc3, @doc2, @doc1]
    end

    it "should return the most viewed public documents when the params order_string equals 'viewed'" do
      docs = Document.all_public_paginated_with_explore_params('viewed')
      docs.should == [@doc1, @doc3, @doc2]
    end

    it "should return all document in a category when the params category_id is set" do
      docs = Document.all_public_paginated_with_explore_params('', @cat1)
      docs.should == [@doc2, @doc1]
    end

    it "should set a number of document per page" do
      docs = Document.all_public_paginated_with_explore_params('', '', nil, 2)
      docs.size.should == 2
    end

  end
                                                            
  describe "last_modified_from_following" do
    before do
      @user = Factory(:user)
      @user_to_follow = Factory(:user)
      @user.follow(@user_to_follow.id)
      @user_unknow = Factory(:user)

      now = Time.now

      @doc1 = Factory(:document, :creator => @user_to_follow, :created_at => now-90.minutes, :updated_at => now-60.minutes)
      @doc2 = Factory(:document, :creator => @user_to_follow, :created_at => now-90.minutes, :updated_at => now-58.minutes)
      @doc3 = Factory(:document, :creator => @user_to_follow, :created_at => now-90.minutes, :updated_at => now-56.minutes, :is_public => false)
      @doc4 = Factory(:document, :creator => @user_to_follow, :created_at => now-90.minutes, :updated_at => now-54.minutes, :is_public => false)
      @doc5 = Factory(:document, :creator => @user_unknow, :created_at => now-90.minutes, :updated_at => now-52.minutes)
      @doc6 = Factory(:document, :creator => @user_unknow, :created_at => now-90.minutes, :updated_at => now-50.minutes, :is_public => false)
    end

    it "should find all public documents from following" do
      docs = Document.last_modified_from_following(@user, 10)
      docs.size.should == 2
      docs.should include @doc2
      docs.should include @doc1
    end

    it "should find all public and not public with editor role" do
      @user.has_role!("editor", @doc4)
      docs = Document.last_modified_from_following(@user, 10)
      docs.size.should == 3
      docs.should include @doc4
      docs.should include @doc2
      docs.should include @doc1
    end

    it "should find all public and not public with reader and editor role" do
      @user.has_role!("editor", @doc4)
      @user.has_role!("reader", @doc4)
      docs = Document.last_modified_from_following(@user, 10)
      docs.size.should == 3
      docs.should include @doc4
      docs.should include @doc2
      docs.should include @doc1
    end

    it "should limit the number of document returned" do
      docs = Document.last_modified_from_following(@user, 1)
      docs.size.should == 1
    end

    it "should find only following users documents" do
      @user_unknow.has_role!("editor", @doc4)
      docs = Document.last_modified_from_following(@user_unknow, 10)
      docs.size.should == 0
    end

    it "should return an empty array when the user haven't following users" do
      docs = Document.last_modified_from_following(@user_unknow, 10)
      docs.should == Array.new
    end

    it "should order by updated_at" do
      @doc1.updated_at = Time.now
      @doc1.save!
      docs = Document.last_modified_from_following(@user, 10)
      docs.should == [@doc1, @doc2]
    end

     it "should find all when the user have many following" do
      another_user = Factory(:user)
      @user.follow(another_user.id)
      another_doc = Factory(:document, :creator => another_user, :is_public => true)

      docs = Document.last_modified_from_following(@user, 10)
      docs.size.should == 3
    end

  end
  
  describe "deep_clone" do

    subject{ Factory(:document) }

    before do
      @creator = Factory(:user)
    end

    it "should clone a empty document" do
      clone = subject.deep_clone(@creator, 'test')
      clone.pages.length.should == 1
    end

    it "should clone a document with many pages" do
      subject.pages.create
      clone = subject.deep_clone(@creator, 'test')
      clone.pages.length.should == 2
    end

    it "should clone a document with many pages and many items" do
      subject.pages.first.items.create
      subject.pages.create
      subject.pages.last.items.create
      subject.pages.last.items.create

      clone = subject.deep_clone(@creator, 'test')
      clone.pages.first.items.length.should == 1
      clone.pages.last.items.length.should == 2            
    end

    it "should save when call deep_clone_and_save!" do
      subject.deep_clone_and_save!(@creator, 'test').should be_present
    end

    it "should update the views_count" do
      Factory(:view_count, :viewable => subject)
      subject.reload.views_count.should == 1
      clone = subject.deep_clone_and_save!(@creator, 'test')
      clone.reload.views_count.should == 0
    end

  end

end



# == Schema Information
#
# Table name: documents
#
#  uuid        :string(36)      primary key
#  title       :string(255)
#  deleted_at  :datetime
#  created_at  :datetime
#  updated_at  :datetime
#  description :text
#  size        :text
#  category_id :string(36)
#  creator_id  :string(36)
#  is_public   :boolean(1)      default(FALSE)
#  views_count :integer(4)      default(0)
#  theme_id    :string(36)
#  style_url   :string(255)
#  featured    :integer(4)      default(0)
#

