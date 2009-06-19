require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')
require 'storage/filesystem'


def mk_storage_fs_file(path, content = '')
  path = File.join(@storage.basedir, path) if path.to_s !~ /^\/.+/

  FileUtils.mkdir_p(File.dirname(path))
  File.open(path, 'w') do |file|
    file << content
  end

  path
end

describe Storage::Filesystem do

  it_should_behave_like "storage interface"

  before(:each) do
    @storage = Storage.storage(:name => :filesystem)

    @path = STORAGE_VALID_PATH
    @full_path = Pathname.new(File.join(@storage.basedir, @path)).to_s
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

  #
  # PUT
  #
  context "'put' method" do
    it_should_behave_like 'storage interface for put method'
    it_should_behave_like 'storage implementation for put method'

    it "should create empty file without data" do
      lambda { @storage.put(@path) }.should_not raise_error

      File.exist?(@full_path).should be_true
      File.zero?(@full_path).should be_true
    end

    it "should create file with data string" do
      content = 'test content'

      lambda { @storage.put(@path, content) }.should_not raise_error

      File.exist?(@full_path).should be_true
      File.zero?(@full_path).should be_false
      File.read(@full_path).should == content
    end

    it "should create file with data stream" do
      content = 'test content'
      content_stream = Tempfile.new('test-storage-fs.txt')
      content_stream << content

      lambda { @storage.put(@path, content_stream) }.should_not raise_error

      File.exist?(@full_path).should be_true
      File.zero?(@full_path).should be_false
      File.read(@full_path).should == content
    end

    it "should update file" do
      old_content = 'old content'
      new_content = 'new content'

      mk_storage_fs_file(@full_path, old_content)

      lambda { @storage.put(@path, new_content) }.should_not raise_error

      File.zero?(@full_path).should be_false
      File.read(@full_path).should == new_content
    end

  end

  #
  # GET
  #
  context "'get' method" do

    before(:each) do
      @content = 'data content'
      mk_storage_fs_file(@full_path, @content)
    end

    it_should_behave_like 'storage interface for get method'
    it_should_behave_like 'storage implementation for get method'
    
  end

  #
  # EXIST?
  #
  context "'exist?' method" do

    before(:each) do
      @content = 'data content'
      mk_storage_fs_file(@full_path, @content)
    end

    it_should_behave_like 'storage interface for exist? method'
    it_should_behave_like 'storage implementation for exist? method'

  end

  #
  # PUBLIC_URL
  #
  context "'public_url' method" do

    it_should_behave_like 'storage interface for public_url method'
    it_should_behave_like 'storage implementation for public_url method'

  end

  #
  # PRIVATE_URL
  #
  context "'private_url' method" do

    it_should_behave_like 'storage interface for private_url method'
    it_should_behave_like 'storage implementation for private_url method'

  end

  #
  # DELETE
  #
  context "'delete' method" do

    before(:each) do
      mk_storage_fs_file(@full_path)
    end

    it_should_behave_like 'storage interface for delete method'
    it_should_behave_like 'storage implementation for delete method'

    it "should delete file" do
      lambda { @storage.delete(@path) }.should_not raise_error

      File.exist?(@full_path).should_not be_true
    end

    it "should remove directory if empty after delete file" do
      dir = File.dirname(@full_path)
      lambda { @storage.delete(@path) }.should_not raise_error

      File.exist?(dir).should_not be_true
    end

    it "should not remove directory if not empty after delete file" do
      dir = File.dirname(@full_path)
      mk_storage_fs_file(File.join(dir, 'another.file'))

      lambda { @storage.delete(@path) }.should_not raise_error

      File.exist?(dir).should be_true
    end

    it "should not remove parent directory if not empty after delete file" do
      dir = File.expand_path(File.join(File.dirname(@full_path), '..'))
      mk_storage_fs_file(File.join(dir, 'another.file'))

      lambda { @storage.delete(@path) }.should_not raise_error

      File.exist?(dir).should be_true
    end

    it "should not remove basedir if empty after delete file" do
      lambda { @storage.delete(@path) }.should_not raise_error

      File.exist?(@storage.basedir).should be_true   # directory exist
      Dir.entries(@storage.basedir).size.should == 2 # but is empty
    end

  end

  #
  # MOVE
  #
  context "'move' method" do

    before(:each) do
      @content = "content data"
      mk_storage_fs_file(@full_path, @content)

      @path_to = 'another/path/for/file'
      @full_path_to = File.join(@storage.basedir, @path_to)
    end

    it_should_behave_like 'storage interface for move method'
    it_should_behave_like 'storage implementation for move method'

    it "should move file from a path to anoter" do
      lambda { @storage.move(@path, @path_to) }.should_not raise_error

      File.exist?(@full_path_to).should be_true
      File.exist?(@full_path).should be_false

      File.read(@full_path_to).should == @content
    end

    it "should move file to same path (path_to == path_from)" do
      lambda { @storage.move(@path, @path) }.should_not raise_error

      File.exist?(@full_path).should be_true

      File.read(@full_path).should == @content
    end

    it "should remove directory if empty after moving file" do
      dir = File.dirname(@full_path)
      lambda { @storage.move(@path, @path_to) }.should_not raise_error

      File.exist?(dir).should_not be_true
    end

    it "should not remove directory if not empty after moving file" do
      dir = File.dirname(@full_path)
      mk_storage_fs_file(File.join(dir, 'another.file'))

      lambda { @storage.move(@path, @path_to) }.should_not raise_error

      File.exist?(dir).should be_true
    end

    it "should not remove parent directory if not empty after moving file" do
      dir = File.expand_path(File.join(File.dirname(@full_path), '..'))
      mk_storage_fs_file(File.join(dir, 'another.file'))

      lambda { @storage.move(@path, @path_to) }.should_not raise_error

      File.exist?(dir).should be_true
    end

    it "should not remove basedir after moving file" do
      lambda { @storage.move(@path, @path_to) }.should_not raise_error

      File.exist?(@storage.basedir).should be_true   # directory exist
    end
  end

end