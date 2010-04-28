class FixUserUuidAgain < ActiveRecord::Migration
  def self.up
    User.all().each do |user| 
      user.update_attribute(:uuid, UUID::generate)
    end
  end

  def self.down
  end
end
