module TitlesHelper
  
  def document_title(str)
    content_for :title, str
  end
  
  def page_title(str)
    content_for :page_title, str
  end
  
  def external_box_title(str)
    content_for :external_box_title, str
  end
  
end