class WidgetsController < ApplicationController
  before_filter :authenticate_user!
  # GET /widgets
  def index
    per_page = 15
    @widgets = Medias::Widget.paginate(:page => params[:page], :per_page => per_page)
    
    respond_to do |format|
      format.json { render :json => { 
        :widgets => @widgets,
        :pagination => {
          :per_page => per_page,
          :current_page => @widgets.current_page,
          :total_pages => @widgets.total_pages, 
          :next_page => @widgets.next_page,
          :previous_page => @widgets.previous_page,
          :total => @widgets.total_entries }
        }
      } 
    end 
  end
  
  # GET /widgets/:id
  def show
    @widget = Medias::Widget.first(:conditions => ["id = :id OR uuid = :id OR system_name = :id", { :id => params[:id] }])
    
    respond_to do |format|
      format.html { redirect_to @widget.file.url }
      format.json { render :json => @widget }
    end
  end
  
end
