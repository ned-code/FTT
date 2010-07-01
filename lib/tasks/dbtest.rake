namespace :webdoc do

  task :load_test_db do
    Rake::Task["db:fixtures:load"].invoke #load data to development
    Rake::Task["db:test:clone_structure"].invoke #clone development to test
  end

end