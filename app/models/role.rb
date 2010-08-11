class Role < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
    
  attr_accessible :name, :uuid, :user_id#, :document_id, :item_id, :user_list_id
  
  # ================
  # = Associations =
  # ================
  
  #has_many :roles_users
  
  # =================
  # = Class Methods =
  # =================
  
  # Methods used with acl9
  #
  # def self.all_by_user_document_ids_grouped_by_name(user)
  #   roles = all(
  #     :select     => "authorizable_id AS document_id, name",
  #     :joins      => :roles_users,
  #     :conditions => {
  #       :roles       => { :authorizable_type => "Document" },
  #       :roles_users => { :user_id => user.uuid }
  #     }
  #   ).group_by { |role| role.name }
  #   roles.each { |k,v| v.map! { |role| role.document_id } }
  #   roles
  # end
  
end



