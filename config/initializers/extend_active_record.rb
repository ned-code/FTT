class ActiveRecord::Base
  #create a new record with the uuid received in params      
  def self.new_with_uuid(params)
    new_record = self.class_name.constantize.new(params)
    new_record.uuid = params[:uuid]
    new_record
  end
end
