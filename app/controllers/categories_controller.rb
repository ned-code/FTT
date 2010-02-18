class CategoriesController < ApplicationController
  before_filter :login_required
  
  # GET /categories
  def index
    @categories = Category.all
    
    render :json => @categories
  end
  
end
