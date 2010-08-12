class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new #Guest user
    
    if user.admin?
      can :manage, :all
    else
      can :read, Document do |document|
        document && (document.public_viewer_only?
                    || document.public_viewer_comment?
                    || document.public_contributor?
                    || document.public_editor?
                    || document.user_viewer_only?(user)
                    || document.user_viewer_comment?(user)
                    || document.user_contributor?(user)
                    || document.user_editor?(user))
      end
      can :update, Document do |document|
        document && ( document.user_editor?(user)
                      || document.user_contributor?(user)
                      || document.public_contributor?
                      || document.public_editor?)
      end
      can :destroy Document do |document|
        document && document.creator?(user)
      end
      can :create Document do |document|
        !user.new_records?
      end
    end
  end
end
