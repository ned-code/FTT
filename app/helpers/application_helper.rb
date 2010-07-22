module ApplicationHelper
  def build_css_string(css_hash)
    css_string = ''
    css_hash.each do |property, value|
      #convert propertyCapital to property-capital
      propertyCharArray = property.split(//)
      i = 0
      for char in propertyCharArray do
        if(char.upcase!.nil?)
          if i > 0
            property = "#{property[0..(i-1)]}-#{property[i..(property.length-1)]}"
          else
            property = "#{property[0]}-#{property[1..(property.length-1)]}"
          end
          break
        end
        i += 1
      end
      
      if property != 'overflow' && property != 'font_face' && property != 'font-_face' && property != 'font'
      #build the string
        css_string += "#{property}:#{value};"
      end
    end
    css_string
  end
  
  def calcul_z_index(position)
    if position
      z_index = '';
      if position < 10
        z_index = "z-index:5000#{position};"
      elsif position < 100
        z_index = "z-index:500#{position};"
      elsif position < 1000
        z_index = "z-index:50#{position};"
      elsif position < 10000
        z_index = "z-index:5#{position};"
      end
      return z_index
    else
      return 'z-index:50000;'
    end
  end
end