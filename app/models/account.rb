class Account < ActiveRecord::Base
  acts_as_authentic

  def activate!
    update_attribute('active', true)
  end

  def deliver_email_confirmation!
    reset_perishable_token!
    Notifier.deliver_confirm_account_email!(self)
  end
end
