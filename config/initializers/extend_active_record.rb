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

  def relative_created_at
    diff_in_time = Time.now - self.created_at
    diff_in_minutes = ((diff_in_time.abs)/60).round
    text = ""

    case diff_in_minutes
    when 0..59 then text = I18n.t('relative_date.x_hours', :count => 1 )
    when 60..1439 then text = I18n.t('relative_date.x_hours', :count => (diff_in_minutes/60).round )
    when 1440..9800 then text = I18n.t('relative_date.x_days', :count => (diff_in_minutes/60/24).round )
    else
      text = I18n.l(self.created_at.to_date)
    end

    text
  end
  
end
