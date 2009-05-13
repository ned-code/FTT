class DocumentsController < ApplicationController
  permit 'registered'

  def index
    @synchronised_at = Time.now.utc
    @documents = current_user.documents(:with_deleted => (request.format == Mime::XML))

    respond_to do |format|
      format.html
      format.xml
    end
  end

  def show
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:id]) : UniboardDocument.find_by_id(params[:id])

    respond_to do |format|
      if @document && permit?('owner of document')
        format.html
        format.xml { render :xml => @document.to_xml }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
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
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:id]) : UniboardDocument.find_by_id(params[:id])

    respond_to do |format|
      if @document && permit?('owner of document')
        if @document.update_attributes(params[:document])
          format.xml { render :xml => @document.to_xml }
        else
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      else
        format.xml { head :forbidden }
      end
    end
  end

  def destroy
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UniboardDocument.find_by_uuid(params[:id]) : UniboardDocument.find_by_id(params[:id])

    respond_to do |format|
      if @document && permit?('owner of document')
        if @document.destroy
          format.xml { head :ok }
        else
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      else
        format.xml { head :forbidden }
      end
    end
  end

  def destroy_all
    UniboardDocument.delete_all
    Role.delete_all
    RolesUser.delete_all
    Storage::S3::Configuration.config.bucket.clear
    User.all.each {|u| u.is_registered }

    respond_to do |format|
      format.html { render :text => "Boom ;-)" }
    end
  end
end
