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
  
  def self.generate(user_id, mails_list)
    mails_list.each do |mail|
      invitation = Invitation.create!(:user_id => user_id)
      #send mail here
    end
  end
end
