if Rails.env == 'test'

  unless ARGV.any? {|a| a =~ /^gems/} # Don't load anything when running the gems:* tasks

  require 'spec/rake/spectask'

  namespace :spec do
    desc "Run the code examples in spec/acceptance"
    Spec::Rake::SpecTask.new(:acceptance => "webdoc:load_test_db") do |t|
      t.spec_opts = ['--options', "\"#{Rails.root}/spec/spec.opts\""]
      t.spec_files = FileList["spec/acceptance/**/*_spec.rb"]
    end

    # Setup stats to include acceptance specs
    task :statsetup do
      require 'code_statistics'
      ::STATS_DIRECTORIES << %w(Acceptance\ specs spec/acceptance) if File.exist?('spec/acceptance')
      ::CodeStatistics::TEST_TYPES << "Acceptance specs" if File.exist?('spec/acceptance')
    end
  end

  end

end
