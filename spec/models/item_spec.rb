require 'spec_helper'

describe Item do
      
  describe "default" do
    subject { Factory(:item) }
    
    its(:must_notify) { should be_false }
  end
  
end




# == Schema Information
#
# Table name: items
#
#  uuid       :string(36)      default(""), not null, primary key
#  page_id    :string(36)      not null
#  media_id   :string(36)
#  media_type :string(255)
#  data       :text(16777215)
#  created_at :datetime
#  updated_at :datetime
#  position   :integer(4)
#  kind       :string(255)
#  inner_html :text(16777215)
#

