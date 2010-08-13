class Notifier < ActionMailer::Base
  default :from => APP_CONFIG['mail_from']
  
  def role_notification(current_user, role, user, document, message)
    @role = role
    @user = user
    @current_user = current_user
    @document = document
    @custom_message = message
    recipients  user.email
    subject     "#{current_user.username} invites you to co-edit webdoc #{document.title}"
    mail(:to => recipients,
         :subject => subject)
  end
  
  def no_role_notification(current_user, user, document)
    @user = user
    @current_user = current_user
    @document = document
    recipients  user.email
    subject     "No more role on document"
    mail(:to => recipients,
         :subject => subject)
  end
  
  def removed_role_notification(current_user, role, user, document)
    @user = user
    @current_user = current_user
    @document = document
    @role = role
    recipients  user.email
    subject     "#{current_user.username} removes you from the co-editors of document #{document.title}"
    mail(:to => recipients,
         :subject => subject)
  end
  
  def start_follower_notification(user, follower)
    @user = user
    @follower = follower
    recipients  user.email
    subject     "#{follower.username} is now following you on WebDoc!"

    mail(:to => recipients,
         :subject => subject)
  end
  
  def stop_follower_notification(user, follower)
    @user = user
    @follower = follower
    recipients  user.email
    subject     "#{follower.username} is no more following you on WebDoc!"
    mail(:to => recipients,
         :subject => subject)
  end
  
  def new_user_notification(recipients, new_user)
    @new_user = new_user
    recipients  recipients
    subject     "[webdoc alpha] User #{new_user.email} just signed up."
    mail(:to => recipients,
         :subject => subject)
  end
  
  def send_daily_report(recipients, filename)
    recipients  recipients
    subject     "[webdoc #{Rails.env}] Your Daily Report"
    attachments['daily_report.csv'] = File.read(filename)
    mail(:to => recipients,
         :subject => subject)
  end
  
  def request_friendship(user,friend)
    @user = user
    @friend = friend
    recipients friend.email
    subject "#{user.username} wants to connect with you"
    mail(:to => recipients,
         :subject => subject)
  end
  
  def accept_friendship(user,friend)
    @user = user
    @friend = friend
    recipients user.email
    subject "#{friend.username} is now connect with you"
    mail(:to => recipients,
         :subject => subject)
  end
end
