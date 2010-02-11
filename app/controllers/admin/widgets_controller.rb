class Admin::WidgetsController < ApplicationController
  before_filter :admin_required
  
  # GET /admin/apps
  def index
    @widgets = Medias::Widget.all
    
    respond_to do |format|
      format.html
      format.json { render :json => @widgets }
    end
  end
  
  # GET /admin/apps/new
  def new
    @widget = Medias::Widget.new
  end
  
  # POST /admin/apps
  def create
    @widget = Medias::Widget.new(:file => params[:medias_widget][:file], :system_name => params[:medias_widget][:system_name])
    
    if @widget.save
      respond_to do |format|
        format.html { redirect_to admin_widgets_path }
        format.json { render :json => @widget }
      end
    else
      #@widget.delete_widget_folder
      render :new
    end
  end
  
  # DELETE /admin/apps/:id
  def destroy
    @widget = Medias::Widget.find_by_uuid(params[:id])
    @widget.destroy
    
    flash[:notice] = I18n.t 'flash.notice.widget_destroyed_successful'
    redirect_to admin_widgets_path
  end
  
  # GET /admin/apps/:id/edit
  def edit
    @widget = Medias::Widget.find_by_uuid(params[:id])
  end
  
  # PUT /admin/apps/:id
  def update
    @widget = Medias::Widget.find_by_uuid(params[:id])
    # Check if a new file has been give, if so, update widget files, else only attributes
    if params[:medias_widget][:file]
      result = @widget.update_with_file(params[:medias_widget][:file])
      if result == "updated"
        flash[:notice] = I18n.t 'flash.notice.widget_updated_successful'
        redirect_to admin_widgets_path
      elsif result == "error"
        #@widget.delete_widget_folder
        flash[:notice] = I18n.t 'flash.notice.widget_updated_failed'
        render :edit
      elsif result == "no_update_needed"
        flash[:notice] = I18n.t 'flash.notice.widget_already_up_to_date'
        render :edit
      end
    else
      if @widget.update_attributes(params[:medias_widget])
        flash[:notice] = I18n.t 'flash.notice.widget_updated_successful'
        redirect_to admin_widgets_path
      else
        flash[:notice] = I18n.t 'flash.notice.widget_updated_failed'
        render :edit
      end
    end
  end
  
protected
  
  def admin_required
    (current_user.present? && current_user.has_role?("admin")) || access_denied
  end
end