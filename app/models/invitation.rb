class Invitation < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
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
                                        :role => role
                                        )
      
      Notifier.send_invitation(user,email, message, role, document).deliver
    end
    
    def accept!
     #TODO
    end
  end
end
