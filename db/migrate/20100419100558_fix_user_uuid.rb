class FixUserUuid < ActiveRecord::Migration
  def self.up
    uuid_generator = UUID.new
    User.all().each do |user| 
      user.update_attribute(:uuid, UUIDTools::UUID.random_create.to_s)
      user.save
    end
  end

  def self.down
  end
end
