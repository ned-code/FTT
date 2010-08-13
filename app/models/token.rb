class Token < ActiveRecord::Base

  ALLOWED_APPLICATION_IDS = ['a2c495d0-874b-012d-eb98-7c6d628d55ce']

  set_primary_key :uuid

  has_uuid

  validates_presence_of :uuid
  validates_presence_of :application_id
  validates_presence_of :user_id
  validates_uniqueness_of :uuid
  validates_uniqueness_of :token
  validates_uniqueness_of :user_id, :scope => :application_id
  validates_inclusion_of :application_id, :in => ALLOWED_APPLICATION_IDS

  belongs_to :user

  def self.create_or_update!(user_id, application_id)
    token = Token.where(['tokens.user_id = ? AND tokens.application_id = ?', user_id, application_id]).first
    if token.blank?
      token = Token.create!({:user_id => user_id,
                             :application_id => application_id,
                             :token => UUID::generate
                            })
    else
      token.token = UUID::generate
      token.save!
    end
    token
  end

end



# == Schema Information
#
# Table name: tokens
#
#  uuid           :string(36)      not null, primary key
#  user_id        :string(36)      not null
#  application_id :string(36)      not null
#  token          :string(36)
#  created_at     :datetime
#  updated_at     :datetime
#

