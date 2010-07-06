class ConvertSizeToSon < ActiveRecord::Migration
  def self.up
    Document.all.each do |document|
      document.update_attribute(:size, document.size)
    end
  end

  def self.down
  end
end
