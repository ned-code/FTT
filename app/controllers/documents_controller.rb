class DocumentsController < ApplicationController
  def index
    @documents = UniboardDocument.all(:order => 'updated_at DESC, created_at DESC')

    respond_to do |format|
      format.xml
    end
  end

  def show
    @document = UniboardDocument.find(params[:id])

    respond_to do |format|
      format.xml { render :action => 'show', :status => 303, :location => @document.url }
    end
  end

  def create
    @document = UniboardDocument.new(params[:document])

    respond_to do |format|
      if @document.save
        format.xml
      else
        format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @document = UniboardDocument.find(params[:id])

    respond_to do |format|
      if @document.destroy
        format.xml { render :action => 'destroy', :status => :ok }
      else
        format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
      end
    end
  end
end
