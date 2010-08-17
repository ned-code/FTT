require 'spec_helper'

describe Media do
  it 'transliterate should downcase and substitute spaces with dashes' do
     'this-is-a-story-headline'.should == Media.transliterate('This is a Story Headline')
  end

  it 'transliterate should remove apostrophes, punctuation, trailing characters' do
     'this-isnt-a-perfect-solution'.should == Media.transliterate(%Q{This isn't a "Perfect Solution."})
  end

  it 'transliterate should turn unicode characters into dashes' do
     'alpha-beta-gamma'.should == Media.transliterate('Alpha α, Beta β, Gamma γ')
  end

  it 'transliterate should turn underscores into dashes' do
     'change-underscores-to-dashes'.should == Media.transliterate('change_underscores_to_dashes')
  end
  
  it 'transliterate should turn + into dashes' do
     'change-plus-into-dashes'.should == Media.transliterate('change+plus+into+dashes')
  end
end


# == Schema Information
#
# Table name: medias
#
#  uuid                    :string(36)      default(""), not null, primary key
#  type                    :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#  properties              :text(16777215)
#  user_id                 :string(36)
#  attachment_file_name    :string(255)
#  system_name             :string(255)
#  title                   :string(255)
#  description             :text
#  attachment_content_type :string(255)
#  attachment_file_size    :integer(4)
#  attachment_updated_at   :datetime
#  favorites               :boolean(1)      default(FALSE)
#  deleted_at              :datetime
#

