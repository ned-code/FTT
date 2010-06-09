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
#  uuid        :string(36)      primary key
#  type        :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  properties  :text(16777215)
#  user_id     :string(36)
#  file        :string(255)
#  system_name :string(255)
#  title       :string(255)
#  description :text
#

