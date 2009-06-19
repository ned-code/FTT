require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'storage'

class Storage::Fake < Storage::Base
end

NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX = /Must be implemented in the '.+' storage type/

STORAGE_VALID_PATH        = 'valid/path/to/file'    # Have more one directory in path
STORAGE_NOT_VALID_PATH    = '/not/valid/path'       # This path is not valid
STORAGE_NOT_EXIST_PATH    = 'file/dont/exist'       # This path to a file never exist but is valid

STORAGE_PUT_PARAMS    = [STORAGE_VALID_PATH]
STORAGE_GET_PARAMS    = [STORAGE_VALID_PATH]
STORAGE_DELETE_PARAMS = [STORAGE_VALID_PATH]
STORAGE_MOVE_PARAMS   = [STORAGE_VALID_PATH, 'new/path/name/to/file']

describe Storage do

  it "should have options param" do
    lambda { Storage.storage }.should raise_error(ArgumentError, /0 for 1/)
  end

  it "should accept options Hash param" do
    lambda { Storage.storage(:name => :fake) }.should_not raise_error(ArgumentError)
  end

  it "should need storage name in options Hash" do
    lambda { Storage.storage({}) }.should raise_error(ArgumentError, /missing :name attribute/)
  end

  it "should accept indentity string param (YAML dump)" do
    identity_string = YAML.dump({:name => :fake})

    lambda { Storage.storage(identity_string) }.should_not raise_error(ArgumentError)
  end

  it "should need storage name in indentity string" do
    identity_string = YAML.dump({})

    lambda { Storage.storage(identity_string) }.should raise_error(ArgumentError, /missing :name attribute/)
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
    # All methods need implementation
    #
    shared_examples_for "storage interface" do

      it "'put' method should be implemented" do
        lambda { @storage.put(*STORAGE_PUT_PARAMS) }.should_not raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

      it "'get' method should be implemented" do
        lambda { @storage.get(*STORAGE_GET_PARAMS) }.should_not raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

      it "'exist?' method should be implemented" do
        lambda { @storage.exist?(*STORAGE_GET_PARAMS) }.should_not raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

      it "'public_url' method should be implemented" do
        lambda { @storage.public_url(*STORAGE_GET_PARAMS) }.should_not raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

      it "'private_url' method should be implemented" do
        lambda { @storage.private_url(*STORAGE_GET_PARAMS) }.should_not raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

      it "'delete' method should be implemented" do
        lambda { @storage.delete(*STORAGE_DELETE_PARAMS) }.should_not raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

      it "'move' method should be implemented" do
        lambda { @storage.move(*STORAGE_MOVE_PARAMS) }.should_not raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end
    end

    #
    # PUT
    #
    shared_examples_for "storage interface for put method" do

      it "should respond to" do
        @storage.should be_respond_to(:put)
      end

      it "should have tow arguments" do
        @storage.method(:put).arity.should == -2
      end

      it "should need 'path' argument" do
        lambda { @storage.put }.should raise_error(ArgumentError, /0 for 1/)
      end

      it "should accept string has 'data' argument" do
        lambda { @storage.put('path/name', '') }.should_not raise_error(ArgumentError)
      end

      it "should accept IO has 'data' argument" do
        lambda { @storage.put('path/name', IO.new(2, 'r')) }.should_not raise_error(ArgumentError)
      end

      it "should accept Tempfile has 'data' argument" do
        lambda { @storage.put('path/name', Tempfile.new('test.txt')) }.should_not raise_error(ArgumentError)
      end

      it "should not need 'data' argument" do
        lambda { @storage.put('path/name') }.should_not raise_error(ArgumentError)
      end

    end

    shared_examples_for "storage implementation for put method" do

      it "should raise ArgumentError if path is invalid" do
        lambda { @storage.put(STORAGE_NOT_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end

      it "should return true when created" do
        lambda {
          @storage.put(@path).should be_true
        }.should_not raise_error
      end

      it "should return true when updated" do
        @storage.put(@path)

        lambda {
          @storage.put(@path).should be_true
        }.should_not raise_error
      end

    end

    context "'put' method" do
      it_should_behave_like 'storage interface for put method'

      it "should not be implemented" do
        lambda { @storage.put(*STORAGE_PUT_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # GET
    #
    shared_examples_for "storage interface for get method" do

      it "should respond to" do
        @storage.should be_respond_to(:get)
      end

      it "should have one arguments" do
        @storage.method(:get).arity.should == 1
      end

      it "should need 'path' argument" do
        lambda { @storage.get }.should raise_error(ArgumentError, /0 for 1/)
      end

      it "should accept block" do
        lambda { @storage.get('path/name') {|data| } }.should_not raise_error(ArgumentError)
      end

    end

    shared_examples_for "storage implementation for get method" do

      it "should raise ArgumentError if path is invalid" do
        lambda { @storage.get(STORAGE_NOT_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end

      it "should return data stream Tempfile" do
        data_stream = @storage.get(@path)

        data_stream.should be_kind_of(Tempfile)
        data_stream.read.should == @content
      end

      it "should return data stream Tempfile in block" do
        pass_in_block = false
        @storage.get(@path) do |data_stream|
          pass_in_block = true

          data_stream.should be_kind_of(Tempfile)
          data_stream.read.should == @content

        end
        pass_in_block.should be_true
      end

      it "should return nil if data doesn't exist" do
        @storage.get(STORAGE_NOT_EXIST_PATH).should be_nil
      end

      it "should not execute block if data doesn't exist" do
        pass_in_block = false
        @storage.get(STORAGE_NOT_EXIST_PATH) do |data_stream|
          pass_in_block = true
        end
        pass_in_block.should be_false
      end

    end

    context "'get' method" do
      it_should_behave_like 'storage interface for get method'

      it "should not be implemented" do
        lambda { @storage.get(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # EXIST?
    #
    shared_examples_for "storage interface for exist? method" do

      it "should respond to" do
        @storage.should be_respond_to(:exist?)
      end

      it "should have one arguments" do
        @storage.method(:exist?).arity.should == 1
      end

      it "should need 'path' argument" do
        lambda { @storage.exist? }.should raise_error(ArgumentError, /0 for 1/)
      end

    end

    shared_examples_for "storage implementation for exist? method" do

      it "should raise ArgumentError if path is invalid" do
        lambda { @storage.exist?(STORAGE_NOT_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end

      it "should return true if data exist" do
        @storage.exist?(@path).should be_true
      end

      it "should return false if data don't exist" do
        @storage.exist?(STORAGE_NOT_EXIST_PATH).should be_false
      end

    end

    context "'exist?' method" do
      it_should_behave_like 'storage interface for exist? method'

      it "should not be implemented" do
        lambda { @storage.exist?(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # PUBLIC_URL
    #
    shared_examples_for "storage interface for public_url method" do

      it "should respond to" do
        @storage.should be_respond_to(:public_url)
      end

      it "should have one arguments" do
        @storage.method(:public_url).arity.should == 1
      end

      it "should need 'path' argument" do
        lambda { @storage.public_url }.should raise_error(ArgumentError, /0 for 1/)
      end

    end

    shared_examples_for "storage implementation for public_url method" do

      it "should raise ArgumentError if path is invalid" do
        lambda { @storage.public_url(STORAGE_NOT_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end

    end

    context "'public_url' method" do
      it_should_behave_like 'storage interface for public_url method'

      it "should not be implemented" do
        lambda { @storage.public_url(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # PRIVATE_URL
    #
    shared_examples_for "storage interface for private_url method" do

      it "should respond to" do
        @storage.should be_respond_to(:private_url)
      end

      it "should have one arguments" do
        @storage.method(:private_url).arity.should == 1
      end

      it "should need 'path' argument" do
        lambda { @storage.private_url }.should raise_error(ArgumentError, /0 for 1/)
      end

    end

    shared_examples_for "storage implementation for private_url method" do

      it "should raise ArgumentError if path is invalid" do
        lambda { @storage.private_url(STORAGE_NOT_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end

    end

    context "'private_url' method" do
      it_should_behave_like 'storage interface for private_url method'

      it "should not be implemented" do
        lambda { @storage.private_url(*STORAGE_GET_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # DELETE
    #
    shared_examples_for "storage interface for delete method" do

      it "should respond to" do
        @storage.should be_respond_to(:delete)
      end

      it "should have one arguments" do
        @storage.method(:delete).arity.should == 1
      end

      it "should need 'path' argument" do
        lambda { @storage.delete }.should raise_error(ArgumentError, /0 for 1/)
      end

    end

    shared_examples_for "storage implementation for delete method" do

      it "should raise ArgumentError if path is invalid" do
        lambda { @storage.delete(STORAGE_NOT_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end

      it "should return true if deleted" do
        @storage.delete(@path).should be_true
      end

      it "should return false if file doesn't exist" do
        @storage.delete(STORAGE_NOT_EXIST_PATH).should be_false
      end

    end

    context "'delete' method" do
      it_should_behave_like 'storage interface for delete method'

      it "should not be implemented" do
        lambda { @storage.delete(*STORAGE_DELETE_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end

    #
    # MOVE
    #
    shared_examples_for "storage interface for move method" do

      it "should respond to" do
        @storage.should be_respond_to(:move)
      end

      it "should have tow arguments" do
        @storage.method(:move).arity.should == 2
      end

      it "should need 'path from' and 'path to' arguments" do
        lambda { @storage.move }.should raise_error(ArgumentError, /0 for 2/)
      end

    end

    shared_examples_for "storage implementation for move method" do

      it "should raise ArgumentError if 'path_from' is invalid" do
        lambda { @storage.move(STORAGE_NOT_VALID_PATH, STORAGE_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end
      
      it "should raise ArgumentError if 'path_to' is invalid" do
        lambda { @storage.move(STORAGE_VALID_PATH, STORAGE_NOT_VALID_PATH) }.should raise_error(ArgumentError, /not be valid/)
      end

      it "should return true if moved" do
        @storage.move(*STORAGE_MOVE_PARAMS).should be_true
      end

      it "should return true if moved to same path (path_from == path_to)" do
        @storage.move(STORAGE_VALID_PATH, STORAGE_VALID_PATH).should be_true
      end

    end

    context "'move' method" do
      it_should_behave_like 'storage interface for move method'

      it "should not be implemented" do
        lambda { @storage.move(*STORAGE_MOVE_PARAMS) }.should raise_error(NotImplementedError, NOT_IMPLEMENTED_ERROR_MESSAGE_REGEX)
      end

    end
    
  end
end

