module DocumentsHelper
  
  def edit_mode?
    !(controller.params[:reader]!= nil && controller.params[:reader] == "true")  &&  current_user.present? && (current_user.has_role?('admin') || current_user.has_role?("editor", @document))
  end
  
end