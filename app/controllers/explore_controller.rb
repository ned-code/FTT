class ExploreController < ApplicationController
  
  # GET /explore
  def index
    @public_documents = Document.find_all_by_is_public(true)
  end
  
end