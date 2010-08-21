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
    role = params[:role]
    user_id = user.id
    message = params[:message]
    emails = params[:emails]
    
    emails.each do |email|
      invitation = Invitation.create!(  :document_id => document_id,
                                        :user_id => user_id,
                                        :role => role
                                        )
      #send email here
      p "sending email to #{email}"
    end
    
    def accept!
     #TODO
    end
  end
end
