class DatastoresController < ApplicationController
  before_filter :authenticate_user!
  
  def index
    @datastore_entries = DatastoreEntry.all_for_current_user_documents(current_user)
  end
  
end
