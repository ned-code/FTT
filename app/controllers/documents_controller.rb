class DocumentsController < ApplicationController
  permit 'registered'

  def index
    @synchronised_at = Time.now.utc
    @documents = current_user.documents(:with_deleted => (request.format == Mime::XML))
    #TODO how to get server url without request object?
    @domain = "#{request.protocol}#{request.host_with_port}"
    respond_to do |format|
      format.html
      format.xml
    end
  end

  def show
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])
    #TODO how to get server url without request object?
    @domain = "#{request.protocol}#{request.host_with_port}"
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
    @document = UbDocument.new(params[:document])

    respond_to do |format|
      if @document.save
        @document.accepts_role 'owner', current_user
        format.xml { render :xml => @document.to_xml }
      else
        format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
      end
    end
  end

  def push
    transaction_uuid = request.env["HTTP_UB_SYNC_TRANSACTION_UUID"] || UUID.generate
    client_uuid = request.env["HTTP_UB_CLIENT_UUID"]

    # Load or create transaction for document
    transaction = UbSyncTransaction.find_or_create_by_ub_document_uuid(params[:id])

    # If transaction is new, continue, or restarted by same client and user, proccess it.
    if transaction.new_record? || transaction.uuid == transaction_uuid ||
        (transaction.ub_client_uuid == client_uuid && transaction.user == current_user)

      # Update transaction uuid if new or restart
      transaction.uuid = transaction_uuid if transaction.uuid != transaction_uuid

      # Set client uuid and user
      transaction.user ||= current_user
      transaction.ub_client_uuid ||= client_uuid

      # Create item
      transaction.items.create(:data => request.raw_post)

      # Return response
      respond_to do |format|
        if transaction.save
          format.xml { render :xml => transaction }
        else
          format.xml { render :xml => transaction.errors, :status => :unprocessable_entity }
        end
      end

    # If a transaction for this document is already started by another user, reject it.
    else
      respond_to do |format|
        format.xml { head :forbidden } # TODO: Better status responde (not forbidden, just already started by another user)
      end
    end
  end

  def update
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])

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
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])

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
    UbDocument.delete_all
    Role.delete_all
    RolesUser.delete_all
    Storage::S3::Configuration.config.bucket.clear
    User.all.each {|u| u.is_registered }

    respond_to do |format|
      format.html { render :text => "Boom ;-)" }
    end
  end
end
