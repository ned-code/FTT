class Notifier < ActionMailer::Base
  default_url_options[:host] = "localhost"

  def user_activation_email(user)
    subject    'Confirm your registration'
    recipients user.email
    from       'no-reply@myuniboard.com'
    sent_on    Time.now

    body       :confirm_url => confirm_user_url(user.perishable_token)
  end

end
