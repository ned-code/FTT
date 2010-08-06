class ActiveRecord::Base
  #create a new record with the uuid received in params      
  def self.new_with_uuid(params)
    new_record = self.new(params)
    new_record.uuid = params[:uuid]
    new_record
  end
  
  def self.create_with_uuid(params)
    new_record = self.new_with_uuid(params)
    new_record.save
    new_record
  end

  # "delete" a row softly
  # model need a deleted_at column
  # Warning, after_destroy callback aren't call !!
  def safe_delete!
    if self.deleted_at.blank?
      self.deleted_at = Time.now
      self.save!
    end
  end
end
