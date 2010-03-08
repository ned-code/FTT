class Notifier < ActionMailer::Base
  def role_notification(role, user, current_user, document, message)
    recipients  user.email
    from        "info@webdoc.com"
    subject     "Editor role on document"
    body        :role => role, :user => user, :current_user => current_user, :document => document, :custom_message => message
  end
  
  def no_role_notification(user, current_user, document)
    recipients  user.email
    from        "info@webdoc.com"
    subject     "No more role on document"
    body        :user => user, :current_user => current_user, :document => document
  end

  def start_follower_notification(user, follower)
    recipients  user.email
    from        "info@webdoc.com"
    subject     "#{follower.username} is now following you on WebDoc!"
    body        :user => user, :follower => follower
  end
  
  def stop_follower_notification(user, follower)
    recipients  user.email
    from        "info@webdoc.com"
    subject     "#{follower.username} is no more following you on WebDoc!"
    body        :user => user, :follower => follower
  end

end
