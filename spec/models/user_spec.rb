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
