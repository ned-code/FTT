module DocumentsHelper
  
  def edit_mode?
    current_user && (current_user.has_role?('admin') || current_user.has_role?("editor", @document))
  end
  
end