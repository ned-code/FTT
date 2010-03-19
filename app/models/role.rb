class Role < ActiveRecord::Base
  acts_as_authorization_role
  
  attr_accessible :name, :authorizable, :authorizable_id, :authorizable_type
  
  # ================
  # = Associations =
  # ================
  
  has_many :roles_users
  
  # =================
  # = Class Methods =
  # =================
  
  def self.all_by_user_document_ids_grouped_by_name(user)
    roles = all(
      :select     => "authorizable_id AS document_id, name",
      :joins      => :roles_users,
      :conditions => {
        :roles       => { :authorizable_type => "Document" },
        :roles_users => { :user_id => user.id }
      }
    ).group_by { |role| role.name }
    roles.each { |k,v| v.map! { |role| role.document_id } }
    roles
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

