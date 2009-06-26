class MediasController < ApplicationController
  permit 'registered'
    
  def show
    @media = params[:id] =~ UUID_FORMAT_REGEX ? UbMedia.find_by_uuid(params[:id]) : UbMedia.find_by_id(params[:id])
    respond_to do |format|
      if @media && permit?('owner of media')
        redirect_to @media.public_url
      else
        format.html { render_optional_error_file(:not_found) }
        format.xml { head :forbidden }
      end
    end
  end
end
