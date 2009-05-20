class Notifier < ActionMailer::Base
  default_url_options[:host] = "ec2-79-125-63-113.eu-west-1.compute.amazonaws.com"

  def user_registration_activation_email(user)
    subject    I18n.t('email.user_registration_activation_email.subject')
    recipients user.email
    from       'no-reply@myuniboard.com'
    sent_on    Time.now

    body       :confirm_url => confirm_user_url(user.perishable_token)
  end

  def user_registration_confirmation_email(user)
    subject    I18n.t('email.user_registration_confirmation_email.subject')
    recipients user.email
    from       'no-reply@myuniboard.com'
    sent_on    Time.now
  end

end
