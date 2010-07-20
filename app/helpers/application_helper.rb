module ApplicationHelper
  def build_css_string(css_hash)
    css_string = ''
    css_hash.each do |property, value|
      css_string += "#{property}:#{value};"
    end
    css_string
  end
end