class Notifier < ActionMailer::Base
  
  def role_notification(current_user, role, user, document, message)
    recipients  user.email
    from        APP_CONFIG['mail_from']
    subject     "#{current_user.username} invites you to co-edit webdoc #{document.title}"
    body        :role => role, :user => user, :current_user => current_user, :document => document, :custom_message => message
  end
  
  def no_role_notification(current_user, user, document)
    recipients  user.email
    from        APP_CONFIG['mail_from']
    subject     "No more role on document"
    body        :user => user, :current_user => current_user, :document => document
  end
  
  def removed_role_notification(current_user, role, user, document)
    recipients  user.email
    from        APP_CONFIG['mail_from']
    subject     "#{current_user.username} removes you from the co-editors of document #{document.title}"
    body        :user => user, :current_user => current_user, :document => document, :role => role
  end
  
  def start_follower_notification(user, follower)
    recipients  user.email
    from        APP_CONFIG['mail_from']
    subject     "#{follower.username} is now following you on WebDoc!"
    body        :user => user, :follower => follower
  end
  
  def stop_follower_notification(user, follower)
    recipients  user.email
    from        APP_CONFIG['mail_from']
    subject     "#{follower.username} is no more following you on WebDoc!"
    body        :user => user, :follower => follower
  end
  
  def new_user_notification(recipients, new_user)
    recipients  recipients
    from        APP_CONFIG['mail_from']
    subject     "[webdoc alpha] User #{new_user.email} just signed up."
    body        :new_user => new_user    
  end
  
  def send_daily_report(recipients)
    recipients  recipients
    from        APP_CONFIG['mail_from']
    subject     "[webdoc alpha] Your Daily Report"
    attachment  :content_type => "text/plein",
                :body => File.read("analytics.csv")
  end
end
