require 'spec_helper'

describe Document do
  should_be_built_by_factory
  should_be_created_by_factory
  should_have_many :pages, :order => 'position ASC', :dependent => :destroy
    
end



# == Schema Information
#
# Table name: documents
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  title       :string(255)
#  deleted_at  :datetime
#  created_at  :datetime
#  updated_at  :datetime
#  description :text
#  keywords    :string(255)
#

