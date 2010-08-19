namespace :webdoc do

  task :load_test_db do
    Rake::Task["db:fixtures:load"].invoke #load data to development
    Rake::Task["db:test:clone_structure"].invoke #clone development to test
  end
  
  desc "Clean the db with inconsistent data"
  task :clean_db => :environment do
    #Look all item that don't belongs_to a page
      Item.all.each do |item|
        if item.page.nil?
          item.destroy
        end
      end
    #Look all page that don't belongs to a document
    Page.all.each do |page|
      if page.document.nil?
        page.items.delete_all
        page.destroy
      end
    end
    #Look all documents that don't have a page
    Document.all.each do |document|
      if document.pages.empty?
        document.destroy
      end
    end
  end
end