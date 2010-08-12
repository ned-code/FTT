class AppPollsController < ApplicationController
  
  #GET /app_polls?item_id => return all votes : accessible only to editors
  #GET /app_polls?item_id&only_current_user=true => return the vote of the current user
  #GET /app_polls?item_id&summary=true => return sumarry of votes (total of votes by choice)
  def index
    #MODE: vote for current user
    if params[:only_current_user] == true || params[:only_current_user] == 'true'
      app_polls = AppPoll.where(:item_id => params[:item_id], :user_id => current_user.uuid)
      render :json => app_polls
    #MODE: summary of all votes
    elsif params[:summary] == true || params[:summary] == 'true'
      app_polls = AppPoll.where(:item_id => params[:item_id])
      hash = {}
      total = 0
      app_polls.each do |p|
        choices = p.choices.split(',')
        choices.each do |c|
            total += 1
            hash[c] = hash[c] ? hash[c] + 1 : 1
        end
      end
      hash[:total] = total
      render :json => hash
    #MODE: all votes
    else
      #TODO - test if user is editor
      app_polls = AppPoll.where(:item_id => params[:item_id])
      render :json => app_polls
    end
  end
  
  #POST /app_polls?item_id&choices&other&geolocalisation
  #Add or update a vote for current user
  def create
    app_poll = AppPoll.create_or_update(current_user,params)
    render :text => ''
  end
  
  #DELETE /app_polls?item_id
  #Delete all votes - accessible only to editors
  def destroy
    AppPoll.destroy_all(:item_id => params[:item_id])
    render :text => ''
  end
  
end
