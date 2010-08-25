module Devise
  module Controllers
    # Those helpers are used only inside Devise controllers and should not be
    # included in ApplicationController since they all depend on the url being
    # accessed.
    module InternalHelpers #:nodoc:
      # Helper for use in before_filters where no authentication is required.
      #
      # Example:
      #   before_filter :require_no_authentication, :only => :new
      
      # Proxy to devise map name
      def resource_name
        devise_mapping.name
      end
      alias :scope_name :resource_name
      
      # Attempt to find the mapped route for devise based on request path
      def devise_mapping
        @devise_mapping ||= request.env["devise.mapping"]
      end
      
      def require_no_authentication
        if warden.authenticated?(resource_name)
          resource = warden.user(resource_name)
          if params[:invitation]
            redirect_url = "#{after_sign_in_path_for(resource)}?invitation=#{params[:invitation]}"
            redirect_to redirect_url
          else
            redirect_to after_sign_in_path_for(resource)
          end
        end
      end
      
    end
  end
end
