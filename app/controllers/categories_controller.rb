class CategoriesController < ApplicationController
  before_filter :authenticate_user!
  
  # GET /categories
  def index
    @categories = Category.all
    
    render :json => @categories
  end
  
end
