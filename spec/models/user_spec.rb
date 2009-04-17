require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe User do
  it { should be_built_by_factory }
  it { should be_created_by_factory }
  
  context 'new user' do
    it 'should not be active' do
      @user = Factory.create(:user)

      @user.should_not be_confirmed
    end

    it 'should be confirmed' do
      @user = Factory.create(:user)
      @user.confirm!.should be_true
      @user.should be_confirmed
    end

    it 'should be registered after activation' do
      @user = Factory.create(:user)
      @user.confirm!.should be_true
      @user.should have_role('registered')
    end
  end
end
