require 'spec_helper'

describe Role do
    
  it "should returns roles user's documents ids grouped by name" do
    user = Factory(:admin)
    document1 = Factory(:document, :creator => user)
    user.has_role!("editor", document1)
    document2 = Factory(:document, :creator => user)
    user.has_role!("reader", document2)
    
    roles = Role.all_by_user_document_ids_grouped_by_name(user)
    roles.should == { "editor" => [document1.id.to_s, document2.id.to_s], "reader" => [document2.id.to_s] }
  end
  
end




# == Schema Information
#
# Table name: roles
#
#  name              :string(40)
#  authorizable_type :string(40)
#  authorizable_id   :string(36)
#  created_at        :datetime
#  updated_at        :datetime
#  uuid              :string(36)      default(""), not null, primary key
#

