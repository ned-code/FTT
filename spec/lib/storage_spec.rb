require File.expand_path(File.dirname(__FILE__) + '/storage_spec_helper')
require 'storage'

# Test Storage::Base class and common methods (with Storage::Fake empty class),
# for _interface_ and _implementation_ shared spec show 'storage_spec_helper.rb'
# file.
class Storage::Fake < Storage::Base
end

describe Storage::Base do

  it "should have options param" do
    lambda { Storage.storage }.should raise_error(ArgumentError, /0 for 1/)
  end

  it "should accept options Hash param" do
    lambda { Storage.storage(:name => :fake) }.should_not raise_error(ArgumentError)
  end

  it "should need storage name in options Hash" do
    lambda { Storage.storage({}) }.should raise_error(ArgumentError, /missing 'name' attribute/)
  end

  it "should accept indentity string param (YAML dump)" do
    identity_string = YAML.dump({:name => :fake})

    lambda { Storage.storage(identity_string) }.should_not raise_error(ArgumentError)
  end

  it "should need storage name in indentity string" do
    identity_string = YAML.dump({})

    lambda { Storage.storage(identity_string) }.should raise_error(ArgumentError, /missing 'name' attribute/)
  end

  it "should return same storage if same options is used more one time" do
    storage_options = {:name => :fake}
    @storage = Storage.storage(storage_options)

    Storage.storage(storage_options).should === @storage
  end

  it "should return new storage if options is not already used" do
    @storage = Storage.storage(:name => :fake, :test => true)

    Storage.storage(:name => :fake, :test => false).should_not === @storage
  end

  it "should raise ArgumentError if storage can't be loaded" do
    lambda { Storage.storage(:name => :dont_exist) }.should raise_error(ArgumentError, /storage 'dont_exist' can't be loaded/)
  end

  it "should have name attribute" do
    @storage = Storage.storage(:name => :fake)

    @storage.name.should == :fake
  end

  it "should have options attribute" do
    @storage = Storage.storage(:name => :fake)

    @storage.options.should be_kind_of(Hash)
  end

  it "should have identity string attribute (YAML dump)" do
    storage_options = {:name => :fake}
    @storage = Storage.storage(storage_options)

    @storage.identity_string.should == YAML.dump(storage_options)
  end

  it "should have identity string has a result of to_s" do
    @storage = Storage.storage(:name => :fake)

    @storage.to_s.should == @storage.identity_string
  end

  context "interface" do

    before(:each) do
      @storage = Storage.storage(:name => :fake)
    end

    #
    # PUT
    #
    context "'put' method" do
      it_should_behave_like 'storage interface for put method'

      it "should not be implemented" do
        lambda { @storage.put(*STORAGE_PUT_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # GET
    #
    context "'get' method" do
      it_should_behave_like 'storage interface for get method'

      it "should not be implemented" do
        lambda { @storage.get(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # EXIST?
    #
    context "'exist?' method" do
      it_should_behave_like 'storage interface for exist? method'

      it "should not be implemented" do
        lambda { @storage.exist?(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # PUBLIC_URL
    #
    context "'public_url' method" do
      it_should_behave_like 'storage interface for public_url method'

      it "should not be implemented" do
        lambda { @storage.public_url(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # PRIVATE_URL
    #
    context "'private_url' method" do
      it_should_behave_like 'storage interface for private_url method'

      it "should not be implemented" do
        lambda { @storage.private_url(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # DELETE
    #
    context "'delete' method" do
      it_should_behave_like 'storage interface for delete method'

      it "should not be implemented" do
        lambda { @storage.delete(*STORAGE_DELETE_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # MOVE
    #
    context "'move' method" do
      it_should_behave_like 'storage interface for move method'

      it "should not be implemented" do
        lambda { @storage.move(*STORAGE_MOVE_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

  end
end

