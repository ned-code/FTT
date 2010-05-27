class UpdateBoolToBooleanInThemeDefault < ActiveRecord::Migration
  def self.up
    default_themes = Theme.find(:all, :select => :uuid, :conditions => { :is_default => true })
        
    remove_column :themes, :is_default
    add_column :themes, :is_default, :boolean, :default => false
    
    default_themes.each do |t|
      t = Theme.find(:first, :conditions => { :uuid => t.uuid })
      t.is_default = true
      t.save!
    end
  end

  def self.down
    default_themes = Theme.find(:all, :select => :uuid, :conditions => { :is_default => true })
        
    remove_column :themes, :is_default
    add_column :themes, :is_default, :bool, :default => false
    
    default_themes.each do |t|
      t = Theme.find(:first, :conditions => { :uuid => t.uuid })
      t.is_default = true
      t.save!
    end
  end
end
