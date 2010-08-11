class ProxyController < ApplicationController
  
  # GET proxy/resolve
  def resolve
    url = params[:url]
    logger.debug(url)
    urlRoot = url.match(/http:\/\/(.*?)\//)
    if (!urlRoot)
      urlRoot = url.match(/http:\/\/.*/)  
    end
    page = RedirectFollower.new(url).resolve
    page.body.gsub!('href="/',"href=\"#{urlRoot}/")
    page.body.gsub!('src="/',"src=\"#{urlRoot}/")
    page.body.gsub!('data="/',"data=\"#{urlRoot}/")
    render :text => page.body
  end
  
  # GET proxy/get
  def get
    url = params[:url]
    render :text => Net::HTTP.get(URI.parse(url))
  end
  
  # POST proxy/post
  def post
    url = params[:url]
    data = params[:data]
    #logger.info data
    if data == nil || data == ''
      data = {}
    end

    render :text => Net::HTTP.post_form(URI.parse(url),data).body
  end
  
  # PUST proxy/put
  def put
    url = params[:url]
    data = params[:data]
    #logger.info data
    if data == nil || data == ''
      data = {}
    end

    url = URI.parse(url)
    req = Net::HTTP::Put.new(url.path)
    req.set_form_data(data)
    response = Net::HTTP.new(url.host, url.port).start { |http| http.request(req) }
    render :text => response.body
    
    #render :text => Net::HTTP.put(URI.parse(url),data)
  end
  
  # DELETE proxy/delete
  def delete
    url = params[:url]

    url = URI.parse(url)
    req = Net::HTTP::Delete.new(url.path)
    response = Net::HTTP.new(url.host, url.port).start { |http| http.request(req) }
    render :text => response.body
    
    #render :text => Net::HTTP::Delete(URI.parse(url))
  end
  
end

class RedirectFollower
  class TooManyRedirects < StandardError; end
  
  attr_accessor :url, :body, :redirect_limit, :response
  
  def initialize(url, limit=5)
    @url, @redirect_limit = url, limit
    logger.level = Logger::INFO
  end
  
  def logger
    @logger ||= Logger.new(STDOUT)
  end
  
  def resolve
    raise TooManyRedirects if redirect_limit < 0
    
    self.response = Net::HTTP.get_response(URI.parse(url))
    
    logger.info "redirect limit: #{redirect_limit}" 
    logger.info "response code: #{response.code}" 
    logger.debug "response body: #{response.body}" 
    
    if response.kind_of?(Net::HTTPRedirection)      
      self.url = redirect_url
      self.redirect_limit -= 1
      
      logger.info "redirect found, headed to #{url}" 
      resolve
    end
    
    self.body = response.body
    self
  end
  
  def redirect_url
    if response['location'].nil?
      response.body.match(/<a href=\"([^>]+)\">/i)[1]
    else
      response['location']
    end
  end
end