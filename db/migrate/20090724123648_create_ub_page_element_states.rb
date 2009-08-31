class CreateUbPageElementStates < ActiveRecord::Migration
  def self.up
    create_table :ub_page_element_states do |t|
      t.string  :data,              :null => false
      t.integer :page_element_id, :null => false
      t.boolean :deleted
      t.timestamps
    end
    add_index(:ub_page_element_states, :page_element_id, { :name => "state_page_element_fk"})
  end

  def self.down
    drop_table :ub_page_element_states
  end
end
