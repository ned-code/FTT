module ActiveRecord #:nodoc:
  module Acts #:nodoc:
    module HasUuid #:nodoc:
      FORMATS = [:compact, :default, :urn] #:nodoc:

      def self.included(base) #:nodoc:
        base.extend(ClassMethods)
      end

      # Use this extension to automatically assign a UUID when your model is created.
      #
      # Example:
      #
      #    class Post < ActiveRecord::Base
      #      has_uuid
      #    end
      #
      # That is all.
      module ClassMethods
        # Configuration options are:
        #
        # * +format+ - sets the UUID generator. Possible values are
        # <tt>:default</tt>:: Produces 36 characters, including hyphens separating the UUID value parts
        # <tt>:compact</tt>:: Produces a 32 digits (hexadecimal) value with no hyphens
        # <tt>:urn</tt>:: Adds the prefix <tt>urn:uuid:</tt> to the default format.
        # * +column+ - specifies the column in which to store the UUID (default: +uuid+).
        def has_uuid(options = {})
          options.reverse_merge!(:format => :default, :column => :uuid)
          raise ArgumentError unless FORMATS.include?(options[:format])

          class_eval do
            send :include, InstanceMethods # hide include from RDoc

            before_validation :assign_uuid, :on => :create

            @@uuid_generator ||= UUID.new
            write_inheritable_attribute :uuid_format, options[:format]
            write_inheritable_attribute :uuid_column, options[:column]
          end
        end
      end

      module InstanceMethods #:nodoc:
        private
          def assign_uuid
            uuid = @@uuid_generator.generate(self.class.read_inheritable_attribute(:uuid_format))
            send("#{self.class.read_inheritable_attribute(:uuid_column)}=", uuid)
          end
      end
    end
  end
end
