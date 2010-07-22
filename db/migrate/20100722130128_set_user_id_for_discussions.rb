class SetUserIdForDiscussions < ActiveRecord::Migration
  def self.up
    Discussion.all.each do |discussion|
      if discussion.user_id.blank?
        comment = discussion.comments.root_only.first
        if comment.present? && comment.user_id.present?
          discussion.user_id = comment.user_id
          discussion.save!
        elsif discussion.page.present? && discussion.page.document.present? && discussion.page.document.creator_id.present?
          discussion.user_id = discussion.page.document.creator_id
          discussion.save!
        else
          puts "Can't find a user_id for discussion #{discussion.uuid}"
        end

      end
    end
  end

  def self.down
    Discussion.all.each do |discussion|
      discussion.user_id = nil
      discussion.save!
    end
  end
end
