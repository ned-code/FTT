require 'fastercsv'
require 'google_spreadsheet'

namespace :analytics do
  desc "Dump some data into a csv file"
  task :process => :environment do
    
    today = Date.today
    
    number_of_users = User.count(:all)
    number_of_users_following_at_least_one_user = Followship.count( :all, :select => 'DISTINCT follower_id' )
    number_of_users_followed_at_least_by_one_user = Followship.count( :all, :select => 'DISTINCT following_id' )
    
    number_of_webdocs = Document.count(:all)
    public_document = Document.all(:conditions => { :is_public => true }, :select => [:uuid])
    number_of_webdocs_published = public_document.size
    
    number_of_pages = Page.count(:all)
    # select count(*) from pages p, documents d where p.document_id = d.uuid and d.is_public = 1
    number_of_pages_published = Page.count(:conditions => {:document_id => public_document})
    
    webdocs_with_more_than_one_co_author = Document.find_by_sql("select d.uuid, count(d.uuid) from documents d, roles r, roles_users ru where d.uuid = r.`authorizable_id` and r.`authorizable_type` = 'Document' and r.name = 'editor' and ru.role_id=r.uuid group by d.uuid having count(d.uuid) > 1;")
    number_of_webdocs_with_more_than_one_co_author = webdocs_with_more_than_one_co_author.length
    
    average = 0.0
    webdocs_with_more_than_one_co_author.each do |d|
      average += Document.count_by_sql(["select count(d.uuid) from documents d, roles r, roles_users ru where d.uuid = ? and d.uuid = r.`authorizable_id` and r.`authorizable_type` = 'Document' and r.name = 'editor' and ru.role_id=r.uuid", d.uuid])
    end
    average_number_of_co_author_for_these = average / number_of_webdocs_with_more_than_one_co_author
    average_number_of_co_author_for_these = "%.1f" % average_number_of_co_author_for_these
    
    number_of_images_uploaded = Medias::Image.count(:all, :conditions => { :favorites => false })
    number_of_images_favorite = Medias::Image.count(:all, :conditions => { :favorites => true })
    number_of_videos_favorite = Medias::Video.count(:all, :conditions => { :favorites => true })
    number_of_medias = number_of_images_uploaded + number_of_images_favorite + number_of_videos_favorite
    
    number_of_images_item = Item.count(:all, :conditions => { :media_type => 'image' })
    number_of_html_item = Item.count(:all, :conditions => { :media_type => 'html' })
    number_of_apps_item = Item.count(:all, :conditions => { :media_type => 'widget' })
    number_of_text_item = Item.count(:all, :conditions => { :media_type => 'text' })
    number_of_iframe_item = Item.count(:all, :conditions => { :media_type => 'iframe' })
    number_of_draw_item = Item.count(:all, :conditions => { :media_type => 'drawing' })
    
    number_of_items_used = number_of_images_item + number_of_html_item + number_of_apps_item + number_of_text_item + number_of_draw_item + number_of_iframe_item
    
    number_of_discussions = Discussion.count(:all)
    number_of_comments = Comment.count(:all)
    number_of_datastore_entries = DatastoreEntry.count(:all)

    data_array = [
        today,
        number_of_users,
        number_of_users_following_at_least_one_user,
        number_of_users_followed_at_least_by_one_user,
        number_of_webdocs,
        number_of_webdocs_published,
        number_of_pages,
        number_of_pages_published,
        number_of_webdocs_with_more_than_one_co_author,
        average_number_of_co_author_for_these,
        number_of_images_uploaded,
        number_of_images_favorite,
        number_of_videos_favorite,
        number_of_medias,
        number_of_items_used,
        number_of_images_item,
        number_of_html_item,
        number_of_apps_item,
        number_of_text_item,
        number_of_iframe_item,
        number_of_draw_item,
        number_of_discussions,
        number_of_comments,
        number_of_datastore_entries
      ]
    #opening csv file
    filename = "#{Rails.root}/reports/analytics.csv"
    begin
      datas = FasterCSV.read(filename)
    rescue
      datas = []
    end
        
    FasterCSV.open(filename, "w") do |csv|
      #append header if there isn't one
      if datas.empty?
        csv << ['Date', 
          'Number of users', 
          'Number of users following at least one user ',
          'Number of users followed at least by someone ',
          'Number of webdocs ',
          'Number of webdocs published ',
          'Number of pages ',
          'Number of pages published ',
          'Number of webdoc with more than one co-autor ',
          'Average number of co-author for these ',
          'Number of images uploaded ',
          'Number of image favorite ',
          'Number of video favorite ',
          'Total number of medias in library ',
          'Number of items used ',
          'Number of images',
          'Number of html',
          'Number of apps',
          'Number of text objects',
          'Number of web page objects',
          'Number of draw objects',
          'Number of discussions ',
          'Number of comments ',
          'Number of datastore entries '
          ]
      else
        #appending old data (it should have a better way to add a single lline at the end of file)
        datas.each do |d|
          csv << d
        end
      end      
      #append new data
      csv << data_array
    end
    #Send the mail
    Notifier.deliver_send_daily_report("mathieu.fivaz@webdoc.com dev@webdoc.com")
    
    # update Google spreadsheet
    ss_session = GoogleSpreadsheet.login("julien.bachmann@webdoc.com", "piet-ib-nu-ab-g")
    ss = ss_session.spreadsheet_by_key 't22rQWW3sFUmSFoJC-2pfSA'
    ws = ss.worksheets[0]
    new_line_number = ws.num_rows + 1
    column = 1
    data_array.each do |value|
      ws[new_line_number, column] = value
      column += 1
    end
    ws.save()
  end
  
end