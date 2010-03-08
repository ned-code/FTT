class DatastoresController < ApplicationController
  def index
    @user_id = current_user ? current_user.id : -1;
    
    #do we need to delete a record
    if params[:delete]
      @record = DatastoreEntry.find_by_id(params[:delete]) #search the record
      
      #delete the record if the user is really the owner of the record
      if @record && @record.user_id.to_i == @user_id.to_i
        @record.destroy
      end
    end
    
    #return all records for current user
    @records = DatastoreEntry.all_for_user_with_extra_data(@user_id)
  end
  
    #GET /datastores/:id
   def show
    render :text => 'to do'
   end
end
