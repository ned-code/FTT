class Role < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  EDITOR = 'editor'
  CONTRIBUTOR = 'contributor'
  VIEWER_COMMENT = 'viewer_comment'
  VIEWER_ONLY = 'viewer_only'
    
  attr_accessible :name, :uuid, :user_id#, :document_id, :item_id, :user_list_id
  
  # ================
  # = Associations =
  # ================
  
  #has_many :roles_users
  
  # =================
  # = Class Methods =
  # =================
  
  def self.all_by_user_document_ids_grouped_by_name(user)
    roles = Role.where(:user_id => user.id).select(:document_id, :name).all.group_by{ |role| role.name }
    roles.each{ |k,v| v.map! { |role| role.document_id }}
  end
  
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
  #   ).group_by { |role| role.name  }
  #   roles.each { |k,v| v.map! { |role| role.document_id } }
  #   roles
  # end
  
end



