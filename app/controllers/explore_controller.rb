class ExploreController < ApplicationController
  
  # GET /explore
  def index
    @public_documents = Document.paginate_by_is_public(true, :page => params[:page], :per_page => 4)
  end
  
end