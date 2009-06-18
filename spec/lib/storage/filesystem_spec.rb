require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')
require 'storage/filesystem'

describe Storage::Filesystem do

  it_should_behave_like "storage interface"

  before(:each) do
    @storage = Storage.storage(:name => :filesystem)

    @path = 'test.txt'
    @full_path = Pathname.new(File.join(@storage.basedir, @path))
  end

  it 'should is a Storage::Filesystem' do
    @storage.should be_a(Storage::Filesystem)
  end

  it 'should not need basedir in options' do
    lambda { Storage.storage(:name => :filesystem) }.should_not raise_error(ArgumentError)
  end

  it 'should accept basedir in options' do
    lambda { Storage.storage(:name => :filesystem, :basedir => STORAGE_FILESYSTEM_BASEDIR) }.should_not raise_error(ArgumentError)
  end

  it 'should have default basedir' do
    storage = Storage.storage(:name => :filesystem)

    storage.basedir == STORAGE_FILESYSTEM_BASEDIR
  end
  
  context "'put' method" do
    it_should_behave_like 'storage interface for put method'
    it_should_behave_like 'storage implementation for put method'

    it "should create empty file without data" do
      lambda { @storage.put(@path) }.should_not raise_error

      @full_path.should be_exist
      @full_path.should be_zero
    end

    it "should create file with data string" do
      content = 'test content'

      lambda { @storage.put(@path, content) }.should_not raise_error

      @full_path.should be_exist
      @full_path.should_not be_zero
      File.read(@full_path).should == content
    end

    it "should create file with data stream" do
      content = 'test content'
      content_stream = Tempfile.new('test-storage-fs.txt')
      content_stream << content

      lambda { @storage.put(@path, content_stream) }.should_not raise_error

      @full_path.should be_exist
      @full_path.should_not be_zero
      File.read(@full_path).should == content
    end

    it "should update file" do
      old_content = 'old content'
      new_content = 'new content'

      File.open(@full_path, 'w') do |file|
        file << old_content
      end

      lambda { @storage.put(@path, new_content) }.should_not raise_error

      @full_path.should_not be_zero
      File.read(@full_path).should == new_content
    end

  end

  context "'get' method" do

    before(:each) do
      @content = 'data content'

      File.open(@full_path, 'w') do |file|
        file << @content
      end
    end

    it_should_behave_like 'storage interface for get method'
    it_should_behave_like 'storage implementation for get method'
    
  end

  context "'exist?' method" do

    before(:each) do
      @content = 'data content'

      File.open(@full_path, 'w') do |file|
        file << @content
      end
    end

    it_should_behave_like 'storage interface for exist? method'
    it_should_behave_like 'storage implementation for exist? method'

  end

  context "'public_url' method" do

    it_should_behave_like 'storage interface for public_url method'
    it_should_behave_like 'storage implementation for public_url method'

  end

  context "'private_url' method" do

    it_should_behave_like 'storage interface for private_url method'
    it_should_behave_like 'storage implementation for private_url method'

  end

  context "'delete' method" do

    it_should_behave_like 'storage interface for delete method'
    it_should_behave_like 'storage implementation for delete method'

  end

  context "'move' method" do

    it_should_behave_like 'storage interface for move method'
    it_should_behave_like 'storage implementation for move method'

  end

end