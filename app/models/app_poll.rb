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
