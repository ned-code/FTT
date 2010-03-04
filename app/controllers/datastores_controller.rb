class DatastoresController < ApplicationController
  def index    
    @user_id = current_user ? current_user.id : -1;
    @records = DatastoreEntry.all_for_user_with_extra_data(@user_id)
  end
  
    #GET /datastores/:id
   def show
    render :text => 'to do'
   end
end
