class DocumentsController < ApplicationController
  before_filter :login_required
  
  def index_page
    @documents = Document.all
    render :action => "index"
  end
  
  # GET /documents
  def index
    @documents = Document.all
    
    respond_to do |format|
      format.json { render :json => @documents }      
    end
  end
  
  # GET /documents/:id
  def show
    @document = Document.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render :json => @document }
    end
  end
  
  # GET /documents/:id/edit
  def edit
    @document = Document.find(params[:id])
  end
  
  # POST /documents
  def create
    @document = Document.new(params[:document])
    @document.uuid = params[:document][:uuid]
    @document.pages.build # add default page
    @document.save

    render :json => @document
  end

  # PUT /documents/:id
  def update
    @document = Document.find(params[:id])
    @document.update_attributes(params[:document])
    
    render :json => @document
  end

  # DELETE /document/:id
  def destroy
    @document = Document.find(params[:id])
    @document.destroy
    
    render :json => {}
  end

end