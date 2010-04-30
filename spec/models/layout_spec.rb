require 'spec_helper'

describe Layout do

  should_allow_mass_assignment_of :uuid, :name, :thumbnail_url
  should_not_allow_mass_assignment_of :id, :theme_id, :model_page_id, :created_at, :updated_at

  should_belong_to :theme
  should_belong_to :model_page, :dependent => :delete
  should_have_many :pages

end
