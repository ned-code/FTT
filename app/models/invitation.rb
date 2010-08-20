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
  
  def self.generate(user_id, params)
    mails_list = params[:emails]
    role = params[:role]
    role = params[:document_id]
    mails_list.each do |mail|
      invitation = Invitation.create!(:user_id => user_id)
      #send mail here
    end
  end
end
