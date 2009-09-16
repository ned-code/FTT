def login_as_mock(stubs = {})
  activate_authlogic
  @current_user = mock_supporter({
    }.merge(stubs)
  )
  UserSession.create(@current_user)
  # if respond_to?(:controller)
  #   controller.stub(:current_supporter).and_return(@current_supporter)
  # end
end
