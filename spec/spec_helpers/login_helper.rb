def login_as_mock(stubs = {})
  activate_authlogic
  @current_user = mock_user({
    }.merge(stubs)
  )
  UserSession.create(@current_user)
  # if respond_to?(:controller)
  #   controller.stub(:current_user).and_return(@current_user)
  # end
end
