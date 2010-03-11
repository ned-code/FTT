class DatastoresController < ApplicationController
  def index        
    #return all records for current user
    @records = DatastoreEntry.all_for_user_with_extra_data
  end
  
end
