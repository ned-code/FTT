class Services::Bluga
  END_POINT = 'http://webthumb.bluga.net/api.php'
  API_KEY = '35025977b721a5b4cdedd2359c5c2992'
  USER_ID = 7115
  DEFAULT_WIDTH  = 640
  DEFAULT_HEIGHT = 480
  # WEBDOC_HOST = 'wd-st.webdoc.com'
  WEBDOC_HOST = 'dev1.webdoc.com'

  def initialize(options={})
    @api_key  = options[:api_key].present?  ? options[:api_key]  : API_KEY
    @user_id  = options[:user_id].present?  ? options[:user_id]  : USER_ID
    @height   = options[:height].present?   ? options[:height]   : DEFAULT_HEIGHT
    @width    = options[:width].present?    ? options[:width]    : DEFAULT_WIDTH
  end

  def process_page(page)

    page.generate_and_set_thumbnail_secure_token
    if page.save
      # begin
        result = self.send("http://#{WEBDOC_HOST}/documents/#{page.document.uuid}/pages/#{page.uuid}?secure_token=#{page.thumbnail_secure_token}", "http://#{WEBDOC_HOST}/documents/#{page.document.uuid}/pages/#{page.uuid}/callback_thumbnail?secure_token=#{page.thumbnail_secure_token}")
      #   raise 'result send request false' if result == false
      # rescue
      #   page.thumbnail_secure_token = nil
      #   page.save!
      # end
    end
  end
  
  def send(url, callback)
    end_point_url = URI.parse(END_POINT)
    request = Net::HTTP::Post.new(end_point_url.path)
    request.body = make_request_xml(url, callback)
    result = Net::HTTP.new(end_point_url.host, end_point_url.port).start {|h| h.request(request) }
    if result.class == Net::HTTPOK
      return true
    else
      return false
    end
  end

  def self.recieve(callback_params)
    if callback_params[:id].present? && callback_params[:secure_token].present?
      page = Page.find_by_thumbnail_secure_token(callback_params[:secure_token])
      job_id = callback_params[:id]
      job_id_length = job_id.length
      job_path = job_id[job_id_length-2..job_id_length] +'/'+ job_id[job_id_length-4..job_id_length-3] +'/'+ job_id[job_id_length-6..job_id_length-5] +'/'
      
      page.remote_thumbnail_url = 'http://webthumb.bluga.net/data/'+job_path+job_id+'-thumb_large.jpg';
      page.thumbnail_need_update = false
      page.thumbnail_secure_token = nil
      page.save!
    else
      raise "thumbnail callback error"
    end
  end

  def make_request_xml(url, callback)
    builder = Builder::XmlMarkup.new
    xml = builder.webthumb do |wt|
      wt.apikey(@api_key)
      wt.request do |r|
        r.url(url)
        r.notify(callback)
        r.width(@width)
        r.height(@height)
        r.delay(15)
      end
    end
    return xml
  end

end
