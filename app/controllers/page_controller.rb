class PageController < DocumentController
  #before_filter :instantiate_page

private
  
  def instantiate_page
    @page = @document.pages.find_by_uuid(params[:page_id])
  end
  
end