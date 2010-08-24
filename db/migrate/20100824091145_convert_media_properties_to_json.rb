class ConvertMediaPropertiesToJson < ActiveRecord::Migration
  def self.up
    Media.all.each do |media|
      if media.properties.present?
        begin
          media.update_attribute(:properties, media.properties)
        rescue => e
          p "error #{e}"
        end
      end
    end
  end

  def self.down
  end
end
