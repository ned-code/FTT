class ExploreController < ApplicationController
  
  # GET /explore
  def index
    @public_documents = Document.all_public_paginated_with_explore_params(params[:main_filter], params[:category_filter], params[:page])
  end
  
end