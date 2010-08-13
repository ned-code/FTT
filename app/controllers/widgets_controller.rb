class WidgetsController < ApplicationController
  # GET /widgets
  def index
    per_page = 100
    cond = {}
    if params[:favorites]
      cond = { :favorites => params[:favorites] }
    end
    @widgets = Medias::Widget.paginate(:page => params[:page], :per_page => per_page, :conditions => cond)
    
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
    @widget = Rails.cache.fetch("widget_#{params[:id]}") { Medias::Widget.first(:conditions => ["uuid = :id OR system_name = :id", { :id => params[:id] }]).to_json }
    
    respond_to do |format|
      format.json { render :json => @widget }
    end
  end
  
end
