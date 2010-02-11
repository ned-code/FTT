class AddTitleAndDescriptionToMedias < ActiveRecord::Migration
  def self.up
      add_column :medias, :title, :string
      add_column :medias, :description, :text
      
      Medias::Widget.all().each do |widget| 
         widget.title = widget.properties[:title] if widget.properties[:title]
         widget.description = widget.properties[:description] if widget.properties[:description]
         widget.save
       end

       Medias::Image.all().each do |image| 
         image.title = image.properties[:name] if image.properties[:name]
         image.save
       end

       Medias::Video.all().each do |video| 
         video.title = video.properties[:name] if video.properties[:name]
         video.description = video.properties[:description] if video.properties[:description]
         video.save
       end
  end

  def self.down
    remove_column :medias, :title
    remove_column :medias, :description
  end
end
