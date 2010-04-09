
module PersonService
    
  def self.person(user_id, security_token)
    return User.find(user_id)
  end

  def self.friends(user_id, security_token)
    user = User.find(user_id)
    return user.mutual_followers 
  end

end
