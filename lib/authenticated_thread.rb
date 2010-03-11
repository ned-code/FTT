module AuthenticatedThread
  
  def self.included(base)
    base.class_eval do
      def self.current_user
        Thread.current[:user]
      end
    end
  end
  
  def current_user
    Thread.current[:user]
  end
  
end

# Set it all up.
if Object.const_defined?("ActiveRecord")
  ActiveRecord::Base.send(:include, AuthenticatedThread)
  ActiveRecord::Observer.send(:include, AuthenticatedThread)
  ActionMailer::Base.send(:include, AuthenticatedThread)
end
