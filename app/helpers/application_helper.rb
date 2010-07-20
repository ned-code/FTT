module ApplicationHelper
  def build_css_string(css_hash)
    css_string = ''
    css_hash.each do |property, value|
      #convert propertyCapital to property-capital
      propertyCharArray = property.split(//)
      i = 0
      for char in propertyCharArray do
        if(char.upcase!.nil?)
          property = "#{property[0..(i-1)]}-#{property[i..(property.length-1)]}"
          break
        end
        i += 1
      end
      
      #build the string
      css_string += "#{property}:#{value};"
    end
    css_string
  end
end