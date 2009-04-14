require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Account do
  it { should be_built_by_factory }
  it { should be_created_by_factory }

  context 'new account' do
    it 'should not be active' do
      @account = Factory.create(:account)

      @account.should_not be_active
    end

    it 'should be activated' do
      @account = Factory.create(:account)
      @account.activate!.should be_true
      @account.should be_active
    end
  end
end
