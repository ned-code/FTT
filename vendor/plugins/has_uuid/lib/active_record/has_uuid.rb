require 'uuid'

module ActiveRecord
  module HasUuid
    
    module ClassMethods
      def has_uuid
        include InstanceMethods unless included_modules.include?(InstanceMethods)
        
        set_primary_key "uuid"  
        before_validation_on_create :assign_uuid
        validates_format_of :uuid, :with => /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
      end
    end
    
    module InstanceMethods
      # before_validation_on_create
      def assign_uuid
        @@uuid_generator ||= UUID.new
        self.uuid ||= @@uuid_generator.generate
      end
    end
    
  end
end