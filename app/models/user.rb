class User < ActiveRecord::Base
  acts_as_authentic
  acts_as_authorized_user
  acts_as_authorizable

  def documents
    is_owner_of_what(UniboardDocument)
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
