class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new #Guest user
    
    # ================
    # = Read =
    # ================
    can :read, Document, :creator_id => user.id
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
    
    can :create, Item do |item|
      item && ( item.page.document.user_editor?(user) ||
                item.page.document.user_contributor?(user) ||
                item.page.document.public_contributor? ||
                item.page.document.public_editor?)
    end
    can :create, Discussion do |discussion|
      discussion && (discussion.document.public_viewer_comment? ||
                     discussion.document.public_contributor? ||
                     discussion.document.public_editor? ||
                     discussion.document.user_viewer_comment?(user) ||
                     discussion.document.user_contributor?(user) ||
                     discussion.document.user_editor?(user))
    end
    can :create, Comment do |comment|
      comment && comment.discussion && comment.discussion
                 (comment.discussion.document.public_viewer_comment? ||
                  comment.discussion.document.document.public_contributor? ||
                  comment.discussion.document.document.public_editor? ||
                  comment.discussion.document.document.user_viewer_comment?(user) ||
                  comment.discussion.document.document.user_contributor?(user) ||
                  comment.discussion.document.document.user_editor?(user))
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
    
    # manque les droites des item crée par les contributor
    can :update, Item do |item|
      item && ( item.page.document.user_editor?(user) ||
                (item.page.document.user_contributor?(user) && item.creator == user) ||
                item.page.document.public_editor? ||
                (item.page.document.public_contributor? && item.creator == user))
    end
    can :update, Discussion do |discussion|
      discussion && ( (discussion.document.public_viewer_comment? && discussion.user == user) ||
                      (discussion.document.public_contributor? && discussion.user == user) ||
                      discussion.document.public_editor? ||
                      (discussion.document.user_viewer_comment?(user) && discussion.user == user) ||
                      (discussion.document.user_contributor?(user) && discussion.user == user) ||
                      discussion.document.user_editor?(user) )
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
    
    # manque les droites des item crée par les contributor
    can :destroy, Item do |item|
      item && ( item.page.document.user_editor?(user) ||
                (item.page.document.user_contributor?(user) && item.creator == user) ||
                item.page.document.public_editor? ||
                (item.page.document.public_contributor? && item.creator == user))
    end
    can :destroy, Discussion do |discussion|
      discussion && ( (discussion.document.public_viewer_comment? && discussion.user == user) ||
                      (discussion.document.public_contributor? && discussion.user == user) ||
                      discussion.document.public_editor? ||
                      (discussion.document.user_viewer_comment?(user) && discussion.user == user) ||
                      (discussion.document.user_contributor?(user) && discussion.user == user) ||
                      discussion.document.user_editor?(user) )
    end
    can :destroy, Comment do |comment|
      comment && comment.discussion && comment.discussion
                 ( (comment.discussion.document.public_viewer_comment? && comment.user == user) ||
                   (comment.discussion.document.document.public_contributor? && comment.user == user) ||
                   comment.discussion.document.document.public_editor? ||
                   (comment.discussion.document.document.user_viewer_comment?(user) && comment.user == user) ||
                   (comment.discussion.document.document.user_contributor?(user) && comment.user == user) ||
                   comment.discussion.document.document.user_editor?(user) )
    end
    
    if user.admin?
      can :manage, :all
    end
  end
end
