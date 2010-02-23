require 'spec_helper'

describe User do
  it { should be_built_by_factory }
  it { should be_created_by_factory }
  
  should_validate_presence_of :username
  
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
  end
  
end


# == Schema Information
#
# Table name: users
#
#  id                   :integer         not null, primary key
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
#  sign_in_count        :integer
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  failed_attempts      :integer         default(0)
#  unlock_token         :string(20)
#  locked_at            :datetime
#  created_at           :datetime
#  updated_at           :datetime
#  first_name           :string(255)
#  last_name            :string(255)
#  avatar               :string(255)
#  bio                  :text
#  gender               :string(255)
#  website              :string(255)
#

