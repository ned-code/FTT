module NavigationHelpers
  # Put here the helper methods related to the paths of your applications
  
  def homepage
    "/"
  end

  def show_document(document_uuid)
    "/documents/#{document_uuid}"
  end

end

Spec::Runner.configuration.include(NavigationHelpers)
