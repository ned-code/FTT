require 'spec_helper'

describe Role do
  
  should_allow_mass_assignment_of :name, :authorizable, :authorizable_id, :authorizable_type
  should_not_allow_mass_assignment_of :id, :created_at, :updated_at
  
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
#  id                :integer         not null, primary key
#  name              :string(40)
#  authorizable_type :string(40)
#  authorizable_id   :integer
#  created_at        :datetime
#  updated_at        :datetime
#

