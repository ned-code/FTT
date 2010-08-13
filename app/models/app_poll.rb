class AppPoll < ActiveRecord::Base
  belongs_to :user
  belongs_to :item
  has_uuid
  set_primary_key :uuid
  
  def self.create_or_update(current_user,params)
    app_poll = AppPoll.where(:item_id => params[:item_id],:user_id => current_user.uuid).first || AppPoll.new
    
    #TODO - check user has right to vote on the poll, and that the item_id is a correct Poll item
    app_poll.item_id = params[:item_id]
    
    app_poll.user_id = current_user.uuid
    app_poll.choices = params[:choices]
    app_poll.other = params[:other]
    app_poll.geolocation = params[:geolocation]
    app_poll.save
    
    return app_poll
  end
end

# == Schema Information
#
# Table name: app_polls
#
#  uuid        :string(36)      not null, primary key
#  user_id     :string(36)
#  item_id     :string(36)
#  choices     :string(255)
#  other       :text
#  geolocation :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

