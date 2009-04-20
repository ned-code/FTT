class DocumentsController < ApplicationController
  permit 'registered'

  def index
    @documents = current_user.is_owner_of_what(UniboardDocument)

    respond_to do |format|
      format.xml
    end
  end

  def show
    @document = UniboardDocument.find(params[:id])

    permit "owner of document" do
      respond_to do |format|
        format.xml { render :action => 'show', :status => 303, :location => @document.url }
      end
    end
  end

  def create
    @document = UniboardDocument.new(params[:document])

    respond_to do |format|
      if @document.save
        @document.accepts_role 'owner', current_user
        format.xml
      else
        format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @document = UniboardDocument.find(params[:id])

    permit "owner of document" do
      respond_to do |format|
        if @document.update_attributes(params[:document])
          format.xml
        else
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      end
    end
  end

  def destroy
    @document = UniboardDocument.find(params[:id])

    permit "owner of document" do
      respond_to do |format|
        if @document.destroy
          format.xml { render :action => 'destroy', :status => :ok }
        else
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      end
    end
  end
end
