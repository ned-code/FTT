class User < ActiveRecord::Base
  acts_as_authentic
  acts_as_authorized_user
  acts_as_authorizable

  def documents
    is_owner_of_what(UniboardDocument)
  end

  def confirm!
    self.is_registered
    update_attribute('confirmed', true)
  end

  def deliver_activation_email!
    reset_perishable_token!
    Notifier.deliver_user_activation_email!(self)
  end
end
