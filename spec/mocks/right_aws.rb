module AppMocks
  module RightAws

    class S3

      def bucket(name, create=false, perms=nil, headers={})
        Bucket.new(self, name)
      end

      class Bucket
        attr_reader :s3, :name, :mock_keys

        def initialize(s3, name, creation_date=nil, owner=nil)
          @s3 = s3
          @name = name

          @mock_keys = {}
          @mock_keys_stack = []
        end

        def mock_keys_stack
          @mock_keys_stack
        end

        def key(key_name, head=false)
          mock_keys_stack.empty? ? (@mock_keys[key_name] ||= Key.new(self, key_name)) : mock_keys_stack.shift
        end

        def keys(options={}, head=false)
          []
        end

      end

      class Key

        attr_reader :bucket, :name

        def initialize(bucket, name, data=nil, meta_headers={})
          @bucket = bucket
          @name = name
          @data = data
        end

        def put(data=nil, perms=nil, headers={})
          @data = data
        end

        def public_link
          "http://s3.amazone.com/#{bucket.name}/#{name}"
        end

        def delete
          nil
        end

      end

    end
  end
end