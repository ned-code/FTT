class DocumentsController < ApplicationController
  #permit 'registered'

  def index
    @synchronised_at = Time.now
    @documents = current_user ? current_user.is_owner_of_what(UniboardDocument) : []

    respond_to do |format|
      format.xml
    end
  end

  def show
    @document = params[:uuid] ? UniboardDocument.find_by_uuid(params[:uuid]) : UniboardDocument.find(params[:id])

    permit 'owner of document' do
      respond_to do |format|
        format.xml { render :xml => @document.to_xml }
      end
    end
  end

  def create
    @document = UniboardDocument.new(params[:document])

    respond_to do |format|
      if @document.save
        @document.accepts_role 'owner', current_user if current_user
        format.xml { head :ok }
      else
        format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @document = params[:uuid] ? UniboardDocument.find_by_uuid(params[:uuid]) : UniboardDocument.find(params[:id])

    permit 'owner of document' do
      respond_to do |format|
        if @document.update_attributes(params[:document])
          format.xml { head :ok }
        else
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      end
    end
  end

  def destroy
    @document = params[:uuid] ? UniboardDocument.find_by_uuid(params[:uuid]) : UniboardDocument.find(params[:id])

    permit 'owner of document' do
      respond_to do |format|
        if @document.destroy
          format.xml { head :ok }
        else
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      end
    end
  end
end
