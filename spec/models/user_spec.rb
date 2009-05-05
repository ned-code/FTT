require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe User do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  it { should validate_presence_of(:firstname, :lastname)}
  
  context 'new user' do
    it 'should not be active' do
      @user = Factory.create(:user)

      @user.should_not be_confirmed
    end

    it 'should be confirmed' do
      @user = Factory.create(:user)
      @user.confirm!.should be_true
      @user.should be_confirmed
      @user.should_not be_changed
    end

    it 'should be registered after activation' do
      @user = Factory.create(:user)
      @user.confirm!.should be_true
      @user.should have_role('registered')
      @user.should_not be_changed
    end

    it 'should not save user when is confirmed' do
      @user = Factory.create(:user)
      @user.email = 'change@test.com'

      @user.confirm!.should be_true
      @user.confirmed_changed?.should_not be_true
      @user.email_changed?.should be_true

      @user.reload
      @user.should be_confirmed
    end
  end
end
