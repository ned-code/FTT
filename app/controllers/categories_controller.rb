class CategoriesController < ApplicationController
  
  # GET /categories
  def index
    @categories = Category.all
    
    render :json => @categories
  end
  
end
