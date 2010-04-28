class Layout < ActiveRecord::Base

  has_uuid

  attr_accessible :uuid, :name, :thumbnail_url  
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :theme
  belongs_to :model_page, :class_name => "Page", :foreign_key => "model_page_id"
  has_many :pages

  # ===============
  # = Validations =
  # ===============
  
  validates_presence_of :thumbnail_url

  # ====================
  # = Instance Methods =
  # ====================

  def to_param
    uuid
  end

  def create_model_page!
    if self.model_page.blank?
      page = self.build_model_page
      page.data = { :css => { :width => '600px', :height => '400px', :backgroundColor => "#fff" } }
      self.save!
    end
  end

end
