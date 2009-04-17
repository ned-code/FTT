class DocumentsController < ApplicationController
  def index
    @documents = UniboardDocument.all(:order => 'updated_at DESC, created_at DESC')

    respond_to do |format|
      format.xml
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
end
