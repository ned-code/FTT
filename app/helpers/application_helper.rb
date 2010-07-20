module ApplicationHelper
  def build_css_string(css_hash)
    css_string = ''
    css_hash.each do |property, value|
      #convert propertyCapital to property-capital
      propertyArray = property.split(//)
      propertyCharArray.each { |c| }
      css_string += "#{property}:#{value};"
    end
    css_string
  end
end