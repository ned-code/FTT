class Admin::CategoriesController < Admin::AdminController
  
  # GET /admin/categories
  def index
    @categories = Category.all
    
    respond_to do |format|
      format.html
      format.json { render :json => @categories }
    end
  end
  
  # GET /admin/categories/new
  def new
    @category = Category.new
  end
  
  # POST /admin/categories
  def create
    @category = Category.new(params[:category])
    
    if @category.save
      Rails.cache.delete("categories_json")
      respond_to do |format|
        format.html { redirect_to admin_categories_path }
        format.json { render :json => @category }
      end
    else
      render :new
    end
  end
  
  
  # GET /admin/categories/:id/edit
  def edit
    @category = Category.find(params[:id])
  end
  
  # PUT /admin/categories/:id
  def update
    @category = Category.find(params[:id])
    
    if @category.update_attributes(params[:category])
      Rails.cache.delete("categories_json")
      redirect_to admin_categories_path
    else
      render :edit
    end
  end
  
  # DELETE /admin/categories/:id
  def destroy
    @category = Category.find(params[:id])
    @category.destroy
    Rails.cache.delete("categories_json")
    flash[:notice] = t('flash.notice.category.destroyed_successful')
    redirect_to admin_categories_path
  end
  
end
