class DocumentsController < ApplicationController
  permit 'registered'

  def index
    @synchronised_at = Time.now.utc
    @documents = current_user.documents(:with_deleted => true)

    respond_to do |format|
      format.xml
    end
  end

  def show
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:id]) : UniboardDocument.find(params[:id])
    raise ActiveRecord::RecordNotFound unless @document

    permit 'owner of document' do
      respond_to do |format|
        format.xml { render :xml => @document.to_xml(:page_url => true) }
      end
    end
  end

  def create
    @document = UniboardDocument.new(params[:document])

    respond_to do |format|
      if @document.save
        @document.accepts_role 'owner', current_user
        format.xml { render :xml => @document.to_xml }
      else
        format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:id]) : UniboardDocument.find(params[:id])
    raise ActiveRecord::RecordNotFound unless @document

    permit 'owner of document' do
      respond_to do |format|
        if @document.update_attributes(params[:document])
        format.xml { render :xml => @document.to_xml }
        else
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      end
    end
  end

  def destroy
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:id]) : UniboardDocument.find(params[:id])
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
    current_user.documents.each do |document|
      document.destroy!
    end
#    UniboardDocument.delete_all!
#    Role.delete_all
#    RolesUser.delete_all
#    User.all.each {|u| u.is_registered }

    respond_to do |format|
      format.html { render :text => "Boom ;-)" }
    end
  end
end
