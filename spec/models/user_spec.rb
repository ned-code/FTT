# == Schema Information
#
# Table name: users
#
#  id                  :integer         not null, primary key
#  email               :string(255)     not null
#  name                :string(255)     not null
#  confirmed           :boolean         not null
#  crypted_password    :string(255)     not null
#  password_salt       :string(255)     not null
#  persistence_token   :string(255)     not null
#  single_access_token :string(255)     not null
#  perishable_token    :string(255)     not null
#  login_count         :integer         default(0), not null
#  failed_login_count  :integer         default(0), not null
#  last_request_at     :datetime
#  current_login_at    :datetime
#  last_login_at       :datetime
#  current_login_ip    :string(255)
#  last_login_ip       :string(255)
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe User do
  it('') { should be_built_by_factory }
  it('') { should be_created_by_factory }

  it('') { should validate_presence_of(:firstname, :lastname)}

  context 'newly created' do

    before(:each) do
      @user = Factory.create(:user)
    end

    it 'should not have confirmed status' do
      @user.should_not be_confirmed
    end

    it 'should not have registered role' do
      @user.should_not have_role('registered')
    end

    it 'should be confirmed' do
      @user.confirm!.should be_true

      @user.should be_confirmed
    end

    it 'should have registered role after confirmation' do
      @user.confirm!.should be_true

      @user.should have_role('registered')
    end

    it 'should not sace changed attributes when confirm' do
      new_attributes = { :lastname => 'Another' }

      @user.attributes = new_attributes
      @user.confirm!.should be_true

      @user.should be_changed
      @user.reload
      @user.attributes.should_not include(new_attributes)
    end

  end
end
