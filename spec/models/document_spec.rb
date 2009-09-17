# == Schema Information
#
# Table name: documents
#
#  uuid       :string(36)      primary key
#  title      :string(255)
#  deleted_at :datetime
#  created_at :datetime
#  updated_at :datetime
#

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Document do
  should_be_built_by_factory
  should_be_created_by_factory
  should_have_many :pages, :order => 'position ASC', :dependent => :destroy
end
