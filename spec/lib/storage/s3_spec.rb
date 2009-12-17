# require File.expand_path(File.dirname(__FILE__) + '/../storage_spec_helper')
# require 'storage/s3'
# 
# VALID_S3_CONFIG = {
#   'access_key_id' => '12345',
#   'secret_access_key' => 'ABCVDEF'
# }
# 
# describe Storage::S3 do
# 
#   it_should_behave_like "storage interface"
# 
#   before(:each) do
#     @storage = Storage.storage(:name => :s3)
# 
#     @path = STORAGE_VALID_PATH
#     @content = "Hello poilu"
#   end
# 
#   it 'should is a Storage::S3' do
#     @storage.should be_a(Storage::S3)
#   end
# 
#   it 'should not need basedir in options' do
#     lambda { Storage.storage(:name => :s3) }.should_not raise_error(ArgumentError)
#   end
# 
# 
#   context "connection" do
# 
#     it 'should not raise error with valid configuration Hash' do
#       s3_config = VALID_S3_CONFIG.dup
# 
#       lambda { Storage::S3.connection(s3_config) }.should_not raise_error(ArgumentError)
#     end
# 
#     it 'should not raise error without configuration Hash' do
#       lambda { Storage::S3.connection }.should_not raise_error(ArgumentError)
#     end
# 
#     it 'should return same connection with same config' do
#       s3_config = VALID_S3_CONFIG.dup
# 
#       Storage::S3.connection(s3_config).should === Storage::S3.connection(s3_config)
#     end
# 
#     it 'should return different connection with different config' do
#       s3_config = VALID_S3_CONFIG.dup
# 
#       Storage::S3.connection(s3_config.merge(:options => {:test => true})).should_not === Storage::S3.connection(s3_config.merge(:options => {:test => false}))
#     end
# 
#   end
# 
#   #
#   # PUT
#   #
#   context "'put' method" do
#     it_should_behave_like 'storage interface for put method'
#     it_should_behave_like 'storage implementation for put method'
# 
#   end
# 
#   #
#   # GET
#   #
#   context "'get' method" do
# 
#     it_should_behave_like 'storage interface for get method'
#     it_should_behave_like 'storage implementation for get method'
# 
#   end
# 
#   #
#   # EXIST?
#   #
#   context "'exist?' method" do
# 
#     it_should_behave_like 'storage interface for exist? method'
#     it_should_behave_like 'storage implementation for exist? method'
# 
#   end
# 
#   #
#   # PUBLIC_URL
#   #
#   context "'public_url' method" do
# 
#     it_should_behave_like 'storage interface for public_url method'
#     it_should_behave_like 'storage implementation for public_url method'
# 
#   end
# 
#   #
#   # PRIVATE_URL
#   #
#   context "'private_url' method" do
# 
#     it_should_behave_like 'storage interface for private_url method'
#     it_should_behave_like 'storage implementation for private_url method'
# 
#   end
# 
#   #
#   # DELETE
#   #
#   context "'delete' method" do
# 
#     it_should_behave_like 'storage interface for delete method'
#     it_should_behave_like 'storage implementation for delete method'
# 
#   end
# 
#   #
#   # MOVE
#   #
#   context "'move' method" do
# 
#     it_should_behave_like 'storage interface for move method'
#     it_should_behave_like 'storage implementation for move method'
# 
#   end
# 
# end