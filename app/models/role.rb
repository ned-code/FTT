class Role < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  ADMIN = 'admin'
  EDITOR = 'editor'
  CONTRIBUTOR = 'contributor'
  VIEWER_COMMENT = 'viewer_comment'
  VIEWER_ONLY = 'viewer_only'
  PUBLIC_ROLES = [VIEWER_COMMENT, VIEWER_ONLY]
  attr_accessible :name, :uuid, :user_id, :document_id, :item_id, :user_list_id
  
  # ================
  # = Associations =
  # ================
    belongs_to :user
    belongs_to :user_list
    belongs_to :document
    belongs_to :item
  # ================
  # = Scope =
  # ================
  
  scope :public, where(:user_id => nil, :user_list_id => nil, :item_id => nil)
  
  # =================
  # = Class Methods =
  # =================
  
  def self.all_by_user_document_ids_grouped_by_name(user)
    roles = Role.where(:user_id => user.id).select(:document_id, :name).all.group_by{ |role| role.name }
    user_roles = {}
    roles.each_pair do |key,value|
      doc_ids = []
      value.each do |v|
        doc_ids << v.document_id
      end
      user_roles["#{key}"] = doc_ids
    end
    #roles = roles.each_pair{ |k,v| v.map! { |role| role.document_id }}
    user_roles
  end
end



