# HTTP Response helper for rspec matchers
class ActionController::TestResponse

  # to test with "should be_unauthorized"
  def unauthorized?
    response_code == 401
  end

  # to test with "should be_forbidden"
  def forbidden?
    response_code == 403
  end

  # to test with "should be_not_found"
  def not_found?
    response_code == 404
  end

end

class ActionController::TestUploadedFile
  attr_accessor :uuid
end
