require 'spec_helper'

describe User do
  it { should be_built_by_factory }
  it { should be_created_by_factory }
  

  describe "admin" do
    subject { Factory(:admin) }
    
    it { subject.has_role?("admin").should be_true }
  end
  
  describe "admin" do
    subject { Factory(:user) }
    
    it "should be able to add an avatar image" do
      subject.avatar = File.open(fixture_path + 'image.jpg')
      subject.save.should be_true
    end
    
    it "should be creator of document his create" do
      document = subject.documents.create
      document.creator.should == subject
    end
  end
  
  describe "followships creation" do
    subject { Factory(:user) }
    
    it "should have followed users" do 
      user = Factory(:user)
      subject.follow(user.id)
      subject.following?(user).should be_true
      subject.following.count.should == 1
      user.followers.count.should == 1
      user.follower?(subject).should be_true
    end
    
    it "should have follower users" do
      user = Factory(:user)
      user.follow(subject.id)
      subject.follower?(user).should be_true
      subject.followers.count.should == 1
    end
    
    it "sould follow only once the same user" do
      user = Factory(:user)
      user.follow(subject.id)
      user.follow(subject.id)
      user.following?(subject).should be_true
      user.following.count.should == 1
    end
    
    it "should have a mutual relationship" do
      user = Factory(:user)
      user.follow(subject.id)
      subject.follow(user.id)
      subject.mutual_follower?(user).should be_true
      user.mutual_follower?(subject).should be_true
      subject.mutual_followers.count.should == 1
      user.mutual_followers.count.should == 1
    end
  end
  
  describe "followships destruction" do
    subject { Factory(:user) }
    
    it "sould remove following relationship" do
      user = Factory(:user)
      user.follow(subject.id)
      user.following?(subject).should be_true
      user.unfollow(subject.id)
      user.following?(subject).should be_false
      user.following.count.should == 0
    end
  end
  
end




# == Schema Information
#
# Table name: users
#
#  email                :string(255)     not null
#  username             :string(255)     not null
#  encrypted_password   :string(255)     not null
#  password_salt        :string(255)     not null
#  confirmation_token   :string(20)
#  confirmed_at         :datetime
#  confirmation_sent_at :datetime
#  reset_password_token :string(20)
#  remember_token       :string(20)
#  remember_created_at  :datetime
#  sign_in_count        :integer(4)
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  failed_attempts      :integer(4)      default(0)
#  unlock_token         :string(20)
#  locked_at            :datetime
#  created_at           :datetime
#  updated_at           :datetime
#  first_name           :string(255)
#  last_name            :string(255)
#  avatar_file_name     :string(255)
#  bio                  :text
#  gender               :string(255)
#  website              :string(255)
#  uuid                 :string(255)     default(""), not null, primary key
#  avatar_content_type  :string(255)
#  avatar_file_size     :integer(4)
#  avatar_updated_at    :datetime
#  id                   :integer(4)
#

