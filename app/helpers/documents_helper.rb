module DocumentsHelper
  
  def edit_mode?
    current_user.present? && (current_user.has_role?('admin') || current_user.has_role?("editor", @document) || !@controller.params[:reader])
  end
  
end