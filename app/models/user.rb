class User < ActiveRecord::Base
  acts_as_authentic
  acts_as_authorized_user
  acts_as_authorizable

  def activate!
    update_attribute('active', true)
  end

  def deliver_email_confirmation!
    reset_perishable_token!
    Notifier.deliver_confirm_user_email!(self)
  end
end
