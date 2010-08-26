module DocumentsHelper
  
  def edit_mode?
    !(controller.params[:reader]!= nil &&
    controller.params[:reader] == "true")  &&
    current_user.present? &&
    ( @document.public_editor? ||
      @document.public_contributor? ||
      @document.user_editor?(current_user) ||
      @document.user_contributor?(current_user) ||
      current_user.has_role?('admin'))
  end

  def interaction_mode?
    controller.params[:edit] != 'true'    
  end
  
end