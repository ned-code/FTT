require 'spec_helper'

describe Media do
  
  should_allow_mass_assignment_of :uuid, :file, :properties, :system_name, :title, :description
  should_not_allow_mass_assignment_of :id, :type, :created_at, :updated_at, :user_id
  
  should_be_built_by_factory
  should_be_created_by_factory
  
end

# == Schema Information
#
# Table name: medias
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(65537)
#  user_id     :integer
#  file        :string(255)
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

