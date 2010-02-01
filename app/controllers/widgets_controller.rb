class WidgetsController < ApplicationController
  before_filter :login_required
  
  # GET /widgets
  def index
    if (params[:system_widget_name])
      @widgets = Medias::Widget.find_by_system_name(params[:system_widget_name])
    else
      # index retunr only widget that are not system widget.
      @widgets = Medias::Widget.paginate(:page => params[:page], :per_page => 50)
    end
    
    
    respond_to do |format|
      format.json { render :json => @widgets }
    end
  end
  
  # GET /widgets
  def listing
    # listing returns all widgets
    if current_user.has_role?("admin")
      @widgets = Medias::Widget.all
    
      respond_to do |format|
        format.html
        format.json { render :json => @widgets }
      end
    else
      redirect_back_or_default
    end
  end
  
  # GET /widgets/new
  def new
    if !current_user.has_role?("admin")
      redirect_back_or_default
    end
  end
  
  
  # GET /widgets/:id
  def show
    @widget = Medias::Widget.find_by_uuid(params[:id])
    #TODO temp check by id if not found by uuid
    if (!@widget)
      @widget = Medias::Widget.find(params[:id])
    end

    respond_to do |format|
      format.html { redirect_to @widget.file.url }
      format.json { render :json => @widget }
    end
  end
  
  # POST /widgets
  def create
    @widget = Medias::Widget.new(:file => params[:widget], :system_name => params[:system_name])
    @widget.assign_uuid
    @widget.set_properties_and_store_file
    
    if @widget.save
      respond_to do |format|
        format.html { redirect_to :controller => "widgets", :action => "listing" }
        format.json { render :json => @widget }
      end
    else
      render :status => 503
    end
  end
  
  # DELETE /widgets/:id
  def destroy
    @widget = Medias::Widget.find_by_uuid(params[:id])
    @widget.destroy
    
    flash[:notice] = I18n.t 'flash.notice.widget_destroyed_successful'
    redirect_to :controller => "widgets", :action => "listing" 
  end
  
  # GET /widgets/:id/edit
  def edit
    if current_user.has_role?("admin")
      @widget = Medias::Widget.find_by_id(params[:id])
    else
      redirect_back_or_default
    end
  end
  
  # GET /widgets/:id/do_update
  def do_update
    if current_user.has_role?("admin")
      @widget = Medias::Widget.find(params[:id])
    else
      redirect_back_or_default
    end
  end
  
  # PUT /widgets/:id
  def update
    @widget = Medias::Widget.find(params[:id])

    @widget.properties[:title] = params[:medias_widget][:title];
    @widget.properties[:description] = params[:medias_widget][:description];
    
    if @widget.save
      redirect_to :controller => "widgets", :action => "listing" 
    else
      @widget.delete_widget_folder
      render :edit
    end
  end
  
  # PUT /widgets/:id
  def update_action
    @widget = Medias::Widget.find(params[:id])
    @widget.update_action(params[:medias_widget][:widget])
    
    flash[:notice] = I18n.t 'flash.notice.widget_updated_successful'
    redirect_to :controller => "widgets", :action => "listing" # Provisory
  end
  
end