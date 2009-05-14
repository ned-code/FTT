require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'storage/filesystem'

describe 'Uniboard Document storage with Filesystem' do

  before(:each) do
  end

  it 'Configuration should have basedir attribute' do
    Storage::Filesystem::Configuration.config.should respond_to(:basedir)
  end

end