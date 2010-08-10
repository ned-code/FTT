class Ability
  include CanCan::Ability

  def initialize(user)
    #if user.admin?
      can :manage, :all
    #else
    #  can :update, Document do |document|
    #    document && Role.where(['roles.document_id = ? AND roles.user_id = ? AND roles.user_', document.uuid, user.uuid])
    #  end

      # can :read, :all
    #end
  end
end
