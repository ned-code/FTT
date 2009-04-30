class DocumentsController < ApplicationController
  permit 'registered'

  def index
    @synchronised_at = Time.now.utc
    @documents = current_user.documents

    respond_to do |format|
      format.xml
    end
  end

  def show
    @document = params[:uuid] ? UniboardDocument.find_by_uuid(params[:uuid]) : UniboardDocument.find(params[:id])
    raise ActiveRecord::RecordNotFound unless @document

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
        @document.accepts_role 'owner', current_user
        format.xml { head :ok }
      else
        format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @document = params[:uuid] ? UniboardDocument.find_by_uuid(params[:uuid]) : UniboardDocument.find(params[:id])
    raise ActiveRecord::RecordNotFound unless @document

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
    raise ActiveRecord::RecordNotFound unless @document

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

  def destroy_all
    current_user.documents.each do |doc|
      doc.destroy!
    end

    respond_to do |format|
      format.html { render :text => "Boom ;-)" }
    end
  end
end
