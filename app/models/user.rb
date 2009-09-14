# == Schema Information
#
# Table name: users
#
#  id                  :integer         not null, primary key
#  email               :string(255)     not null
#  name                :string(255)     not null
#  confirmed           :boolean         not null
#  crypted_password    :string(255)     not null
#  password_salt       :string(255)     not null
#  persistence_token   :string(255)     not null
#  single_access_token :string(255)     not null
#  perishable_token    :string(255)     not null
#  login_count         :integer         default(0), not null
#  failed_login_count  :integer         default(0), not null
#  last_request_at     :datetime
#  current_login_at    :datetime
#  last_login_at       :datetime
#  current_login_ip    :string(255)
#  last_login_ip       :string(255)
#

class User < ActiveRecord::Base
  acts_as_authentic
  acts_as_authorized_user
  acts_as_authorizable

  validates_presence_of :firstname, :lastname

  def documents(*args)
    options = args.extract_options!
    Document.send(:validate_find_options, options)
    Document.send(:set_readonly_option!, options)

    if(options.delete(:with_deleted))
      deleted_condition = ''
    else
      deleted_condition = "AND documents.deleted_at IS NULL"
    end

    Document.find_by_sql("
      SELECT DISTINCT documents.* FROM documents
      INNER JOIN roles ON authorizable_type = 'Document'
        AND authorizable_id = documents.id
      INNER JOIN roles_users ON roles.id = role_id
      INNER JOIN users ON user_id = users.id
      WHERE users.id = #{self.id} #{deleted_condition} order by documents.created_at DESC
    ")
  end

  def confirm!
    self.is_registered

    @attributes_cache.delete('confirmed')
    @attributes['confirmed'] = true

    connection.update("
      UPDATE #{self.class.quoted_table_name}
      SET #{connection.quote_column_name('confirmed')} = #{quote_value(true)}
      WHERE #{connection.quote_column_name(self.class.primary_key)} = #{quote_value(id)}
      ", "#{self.class.name} Updated"
    )
  end

  def deliver_registration_activation_email!
    reset_perishable_token!
    Notifier.deliver_user_registration_activation_email!(self)
  end

  def deliver_registration_confirmation_email!
    Notifier.deliver_user_registration_confirmation_email!(self)
  end

  def deliver_password_reset_email!
    reset_perishable_token!
    Notifier.deliver_user_password_reset_email!(self)
  end
end
