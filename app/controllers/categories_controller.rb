class CategoriesController < ApplicationController
  
  # GET /categories
  def index
    @categories = Rails.cache.fetch("categories_json") { Category.all.to_json }
    render :json => @categories
  end
  
end
