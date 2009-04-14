class Notifier < ActionMailer::Base
  default_url_options[:host] = "localhost"

  def confirm_account_email(account)
    subject    'Confirm your registration'
    recipients account.email
    from       'no-reply@myuniboard.com'
    sent_on    Time.now

    body       :confirm_url => confirm_account_url(account.perishable_token)
  end

end
