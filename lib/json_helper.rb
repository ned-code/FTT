module JsonHelper
  def self.decode_json_and_yaml(value)
    unless(value.nil?)
      begin
        return ActiveSupport::JSON.decode(value)
      rescue
        return YAML.load(value)
      end
    end
    return nil
  end
end