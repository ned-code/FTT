class User < ActiveRecord::Base
  acts_as_authentic
  acts_as_authorized_user
  acts_as_authorizable

  def documents(*args)
    options = args.extract_options!
    UniboardDocument.send(:validate_find_options, options)
    UniboardDocument.send(:set_readonly_option!, options)

    if(options.delete(:with_deleted))
      deleted_condition = ''
    else
      deleted_condition = "AND uniboard_documents.deleted_at IS NULL"
    end

    UniboardDocument.find_by_sql("
      SELECT DISTINCT uniboard_documents.* FROM uniboard_documents
      INNER JOIN roles ON authorizable_type = 'UniboardDocument' AND authorizable_id = uniboard_documents.id
      INNER JOIN roles_users ON roles.id = role_id
      INNER JOIN users ON user_id = users.id
      WHERE users.id = #{self.id} #{deleted_condition}"
    )
  end

  def confirm!
    self.is_registered

    @attributes_cache.delete('confirmed')
    @attributes['confirmed'] = true

    connection.update(
      "UPDATE #{self.class.quoted_table_name} " +
      "SET \"confirmed\" = #{quote_value(true)} " +
      "WHERE #{connection.quote_column_name(self.class.primary_key)} = #{quote_value(id)}",
      "#{self.class.name} Updated"
    )
  end

  def deliver_registration_activation_email!
    reset_perishable_token!
    Notifier.deliver_user_registration_activation_email!(self)
  end

  def deliver_registration_confirmation_email!
    Notifier.deliver_user_registration_confirmation_email!(self)
  end
end
