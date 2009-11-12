class Medias::Image < Media
  has_attached_file :file, :styles => { :thumb => "100x100#" }
   
  before_save :set_properties
  
protected
  
  # before_save
  def set_properties
    self.properties = { :thumb_url => file.url(:thumb), :url => file.url }
  end
  
end