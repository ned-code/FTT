module TitlesHelper
  def title(str)
    content_for :title, str
  end
end