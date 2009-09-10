class DocumentsController < ApplicationController
  permit "registered"

  def create
     uuid =params[:uuid]
     uuid ||= UUID.generate()
     created_at =params[:created_at]
     title =params[:title]
     document = UbDocument.create({:uuid => uuid, :title => title, :created_at => created_at})
     document.accepts_role 'owner', current_user
     data_hash = {}
     data_hash['css'] = {:width => "1280px", :height => "720px", :backgroundColor => "black"}
     default_page = document.pages.build(:uuid => UUID.generate(), :data => data_hash.to_json)
     document.save
     render :json => document.to_json
  end

  def update
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])
    RAILS_DEFAULT_LOGGER.debug "update document with new title #{params[:title]}"
    @document.update_attributes( :title =>params[:title]);
    render :json => @document.to_json
  end

  def index
    @synchronised_at = Time.now.utc
    @documents = []
    #TODO how to get server url without request object?
#    @domain = "#{request.protocol}#{request.host_with_port}"
    respond_to do |format|
      format.html do
        @is_document_page = true
        if (!current_user)
          @documents = UbDocument.find_all_by_is_public(true)
          render :action => 'index_public'
        else
          @documents = current_user.documents(:with_deleted => false)
          @public_documents = UbDocument.find_all_by_is_public(true).select do |an_object|
            !(@documents.include? an_object)
          end
          render :action => 'index'
        end
      end
      format.xml do
        permit 'registered'
          if (current_user)
            @documents = current_user.documents(:with_deleted => true)
          end
      end
      format.json do
        @documents = current_user.documents(:with_deleted => false)
        render :json => @documents.to_json
      end
    end
  end

  def show
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])
    @page = @document.pages[0]
    #TODO how to get server url without request object?
    if (@page)
      @page_url =  @page.url("application/xhtml+xml")
    end
    @domain = request.protocol + request.host_with_port
    respond_to do |format|
      if @document && @page && (@document.is_public || permit?('owner of document'))
        format.html {
          @orbited_js = orbited_javascript
          render :action => "showproto", :layout => false, :content_type => "application/xhtml+xml"
          #redirect_to @page_url
        }
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
#
#    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])
#
#respond_to do |format|
#      if @document
#        if @document.is_public || permit?('owner of document')
#          format.html
#          format.xml { render :xml => @document.to_xml }
#        else
#          format.html { render_optional_error_file(:forbidden) }
#          format.xml { head :forbidden }
#        end
#      else
#          format.html { render_optional_error_file(:not_found) }
#          format.xml { head :not_found }
#      end
#    end
  end

  def push
    sync_action = request.headers["UB_SYNC_ACTION"] || 'continue'
    # Retrive transaction with UUID
    if (request.headers["UB_SYNC_TRANSACTION_UUID"] && request.headers["UB_SYNC_TRANSACTION_UUID"] != '')
      @transaction = UbSyncTransaction.find(:first, :conditions => {
        :uuid => request.headers["UB_SYNC_TRANSACTION_UUID"],
        :ub_document_uuid => params[:id],
        :ub_client_uuid => request.headers["UB_CLIENT_UUID"],
        :user_id => current_user.id
      })
    else
      # Retrive existing transaction for document and user
      @transaction = UbSyncTransaction.find(:first, :conditions => {
        :ub_document_uuid => params[:id],
        :ub_client_uuid => request.headers["UB_CLIENT_UUID"],
        :user_id => current_user.id
      })
      @transaction.destroy if @transaction

      # Create new transaction
      @transaction = UbSyncTransaction.new(
        :uuid => UUID.generate,
        :ub_document_uuid => params[:id],
        :ub_client_uuid => request.headers["UB_CLIENT_UUID"],
        :user => current_user
      )
    end

    # Transaction action
    if @transaction

      # Create item
      if request.headers["UB_SYNC_FILENAME"] && ['continue', 'commit'].include?(sync_action)
        file_name = request.headers["UB_SYNC_FILENAME"]
        content_type = 'application/unknown'
        if (request.headers["UB_SYNC_CONTENT_TYPE"].nil? || request.headers["UB_SYNC_CONTENT_TYPE"] == '')
          if (!MIME::Types.of(file_name).nil? && !MIME::Types.of(file_name).empty?)
            content_type = MIME::Types.of(file_name).first.content_type
          end
        else
          content_type = request.headers["UB_SYNC_CONTENT_TYPE"]
        end
        post_data = Tempfile.new('post_data')
        post_data.binmode
        post_data << request.raw_post
        post_data.flush
        
        @item = @transaction.items.build(
          :path => file_name,
          :content_type => content_type,
          :part_nb => request.headers["UB_SYNC_PART_NB"],
          :part_total_nb => request.headers["UB_SYNC_PART_TOTAL_NB"],
          :part_check_sum => request.headers["UB_SYNC_PART_CHECK_SUM"],
          :item_check_sum => request.headers["UB_SYNC_ITEM_CHECK_SUM"],

          :data => post_data,

          :storage_config => nil # Use default config, TODO: can be configured
        )
      end

      # Return response
      respond_to do |format|
        if sync_action == 'rollback' && @transaction.destroy
          format.xml { head :ok }
        elsif sync_action == 'continue' && @transaction.save
          format.xml { render :xml => @transaction }
        elsif (sync_action == 'commit')
          public_flag = request.headers["UB_PUBLIC_DOCUMENT"] || "FALSE"
          public_flag = public_flag.upcase == "TRUE" || public_flag == "1"
          if (@transaction.commit(public_flag))
            @transaction.destroy
            document = UbDocument.find_by_uuid(params[:id])
            format.xml { render :xml => document.to_xml }
            Notifier.deliver_document_published_email!(current_user, document)
          else
            format.xml { render :xml => @transaction.errors, :status => :unprocessable_entity }
            @transaction.destroy
          end
        else
          format.xml { render :xml => @transaction.errors, :status => :unprocessable_entity }
        end
      end

    # If a transaction for this document is already started by another user, reject it.
    else
      respond_to do |format|
        format.xml { head :not_found }
      end
    end
  end

  def resources
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])
    if @document
        if @document.is_public || permit?('owner of document')
          render :json => @document.resources_json
        else
          render :nothing => true
        end
    else
          render :nothing => true
    end
  end

  def destroy
    @document = params[:id] =~ UUID_FORMAT_REGEX ? UbDocument.find_by_uuid(params[:id]) : UbDocument.find_by_id(params[:id])

    respond_to do |format|
      if @document && permit?('owner of document')
        if @document.destroy
          format.html { redirect_back_or_default documents_url }
          format.xml { head :ok }
          format.json { render :json => {} }
        else
          format.html {render_optional_error_file(:not_found)}
          format.xml { render :xml => @document.errors, :status => :unprocessable_entity }
        end
      else
        format.html { render_optional_error_file(:forbidden)}
        format.xml { head :forbidden }
      end
    end
  end

  def destroy_all
    permit 'registered'
    UbDocument.delete_all
    Role.delete_all
    RolesUser.delete_all
    User.all.each {|u| u.is_registered }

    respond_to do |format|
      format.html { render :text => "Boom ;-)" }
    end
  end
end
