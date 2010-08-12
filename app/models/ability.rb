class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new #Guest user
    
    if user.admin?
      can :manage, :all
    else
      # ================
       # = Read =
       # ================
      can :read, Document do |document|
        document && (document.public_viewer_only? ||
                    document.public_viewer_comment? ||
                    document.public_contributor? ||
                    document.public_editor? ||
                    document.user_viewer_only?(user) ||
                    document.user_viewer_comment?(user) ||
                    document.user_contributor?(user) ||
                    document.user_editor?(user))
      end
      can :read, Page do |page|
        page && (page.document.public_viewer_only? ||
                 page.document.public_viewer_comment? ||
                 page.document.public_contributor? ||
                 page.document.public_editor? ||
                 page.document.user_viewer_only?(user) ||
                 page.document.user_viewer_comment?(user) ||
                 page.document.user_contributor?(user) ||
                 page.document.user_editor?(user))
      end
      # ================
       # = Update =
       # ================
      can :update, Document do |document|
        document && ( document.user_editor?(user) ||
                      document.user_contributor?(user) ||
                      document.public_contributor? ||
                      document.public_editor?)
      end
      can :update, Page do |page|
        page && ( page.document.user_editor?(user) ||
                  page.document.user_contributor?(user) ||
                  page.document.public_contributor? ||
                  page.document.public_editor?)
      end
      
      # ================
       # = Destroy =
       # ================
      can :destroy, Document do |document|
        document && document.creator?(user)
      end
      
      can :destroy, Page do |page|
        page && ( page.document.user_editor?(user) ||
                  page.document.user_contributor?(user) ||
                  page.document.public_contributor? ||
                  page.document.public_editor?)
      end
      
      # ================
       # = Create =
       # ================
      can :create, Document do |document|
        !user.new_record?
      end
      
      can :create, Page do |page|
        page && ( page.document.user_editor?(user) ||
                  page.document.user_contributor?(user) ||
                  page.document.public_contributor? ||
                  page.document.public_editor?)
      end
    end
  end
end
