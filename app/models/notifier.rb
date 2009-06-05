class Notifier < ActionMailer::Base
  default_url_options[:host] = {
    'staging' => 'st-ub.mnemis.com',
    'production' => 'uniboard.mnemis.com',
    'development' => 'localhost:3000',
    'test' => 'localhost'
  }[RAILS_ENV]

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

  def user_password_reset_email(user)
    subject    I18n.t('email.user_reset_password_email.subject')
    recipients user.email
    from       'no-reply@myuniboard.com'
    sent_on    Time.now

    body      :change_password_url => change_password_user_url(user.perishable_token)
  end

end
