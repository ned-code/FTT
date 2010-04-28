class AllowNullToDocumentIdInPages < ActiveRecord::Migration
  def self.up
    change_column_null :pages, :document_id, true
  end

  def self.down
    change_column_null :pages, :document_id, false
  end
end
