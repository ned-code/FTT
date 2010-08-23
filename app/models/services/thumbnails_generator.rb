class Services::ThumbnailsGenerator

  def initialize(options={})
    @end_point      = options['end_point'].present?       ? options['end_point']     : 'http://ec2-174-129-161-254.compute-1.amazonaws.com/thumbnails'
    @thumbnail_url  = options['thumbnail_url'].present?   ? options['thumbnail_url'] : 'http://ec2-174-129-161-254.compute-1.amazonaws.com/thumbnails'
  end

  def thumbnail_url_with_id(uuid)
    @thumbnail_url + "/" + uuid
  end

  def process_page(page)
    page.generate_and_set_thumbnail_secure_token
    page.thumbnail_request_at = Time.now
    if page.save
      begin
        result = self.send(page,
                           "http://#{APP_CONFIG['host']}/documents/#{page.document.uuid}/pages/#{page.uuid}?secure_token=#{page.thumbnail_secure_token}",
                           "http://#{APP_CONFIG['host']}/documents/#{page.document.uuid}/pages/#{page.uuid}/callback_thumbnail?secure_token=#{page.thumbnail_secure_token}")
        raise 'result send request false' if result == false
      rescue
        p "error when send request go thumbnails generator!"
        page.thumbnail_secure_token = nil
        page.save!
      end
    end
  end

  def send(page, url, callback)
    end_point_url = URI.parse(@end_point)
    http = Net::HTTP.new(end_point_url.host, end_point_url.port)
    
    request = Net::HTTP::Post.new(end_point_url.path)
    request.set_form_data(self.make_request_hash(page, url, callback))
    p request.body

    result = http.request(request)

    p result.body

    if result.class == Net::HTTPOK
      return true
    else
      return false
    end
  end

  def self.recieve(callback_params)
    if callback_params['id'].present? && callback_params['secure_token'].present?
      page = Page.find_by_thumbnail_secure_token(callback_params['secure_token'])
      page.remote_thumbnail_url = self.thumbnail_url_with_id(callback_params['id']);
      page.thumbnail_need_update = false
      page.thumbnail_secure_token = nil
      page.thumbnail_request_at = nil
      page.save!
    else
      raise "thumbnail callback error"
    end
  end

  def make_request_hash(page, url, callback)
    size = page.calc_thumbnail_frame_size
    thumb_size = Page.calc_thumbnail_size(size)
    {
      'url'          => url,
      'callback_url' => callback,
      'delay'        => 15,
      'frame_width'  => size['width'],
      'frame_height' => size['height'],
      'thumb_width'  => thumb_size['width'],
      'thumb_height' =>thumb_size['height']
    }
  end

end
