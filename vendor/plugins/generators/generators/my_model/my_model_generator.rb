require 'rails_generator/generators/components/model/model_generator'

class MyModelGenerator < ModelGenerator

  def manifest
    record do |m|
      # Check for class naming collisions.
      m.class_collisions class_path, class_name

      # Model, spec, and fixture directories.
      m.directory File.join('app/models', class_path)
      m.directory File.join('spec/models', class_path)
      m.directory File.join('spec/fixtures', class_path) unless options[:skip_fixture]
      m.directory File.join('spec/factories', class_path) unless options[:skip_factory]

      # Model class, spec and fixtures.
      m.template 'model:model.rb',      File.join('app/models', class_path, "#{file_name}.rb")
      m.template 'model_spec.rb',       File.join('spec/models', class_path, "#{file_name}_spec.rb")
      m.template 'model_fixtures.yml',  File.join('spec/fixtures', "#{table_name}.yml") unless options[:skip_fixture]
      m.template 'model_factory.rb',    File.join('spec/factories', "#{table_name}.rb") unless options[:skip_factory]

      unless options[:skip_migration]
        m.migration_template 'model:migration.rb', 'db/migrate', :assigns => {
          :migration_name => "Create#{class_name.pluralize.gsub(/::/, '')}"
        }, :migration_file_name => "create_#{file_path.gsub(/\//, '_').pluralize}"
      end

    end
  end

end
