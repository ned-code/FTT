class Invitation < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  PENDIG = 'pending'
  ACCEPTED = 'accepted'
  
  # ===============
  # = Validations =
  # ===============
  validates_uniqueness_of :uuid
  validates_presence_of :user_id, :uuid
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  belongs_to :document
  
  # ================
  # = Scope =
  # ================
  
  scope :pending, where(:status => ACCEPTED)
  
  # =================
  # = Class Methods =
  # =================
  
  def self.generate(user, params)
    document_id = params[:document_id]
    document = Document.where(:uuid => document_id).first
    role = params[:role]
    user_id = user.id
    message = params[:message]
    emails = params[:emails]
    
    emails.each do |email|
      invitation = Invitation.create!(  :document_id => document_id,
                                        :user_id => user_id,
                                        :role => role,
                                        :status => PENDIG
                                        )
      
      Notifier.send_invitation(user,email, message, role, document, invitation.id).deliver
    end
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def accept!(friend)
    if !user.friend?(friend)
      begin
        friendhsip = Friendship.create_friendship!(friend, self.user)
        friend.accept!
      rescue
      end
    end
    
    if !self.role.nil? && self.role != ''
      friend.has_role!(role, document)
    end
    self.update_attribute(:status, ACCEPTED)
  end
end
