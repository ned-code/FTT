
class WikibotController < ActionController::Base
	
	def search 

	require 'net/http'
	
	@input = params[:input]
	@lang = params[:lang]
	@mode = params[:mode]
	
	if @mode == 'wiki'
		

		 @surl = "http://" + @lang +".wikipedia.org/wiki/Special:Search/" + @input
		 		page = RedirectFollower.new(@surl).resolve

    	 puts @surl	
    	 	
   		
   		 puts page.body;
    
   		 @reqUrl = '<a href="http://' + @lang + '.wikipedia.org/wiki/Special:Search'
    
		 @fixImgLinks = page.body.gsub('<a href="/wiki',@reqUrl);
		 
		 ##@audioScript = '<script type="text/javascript" src="http://www.wikipedia.org/w/extensions/OggHandler/OggPlayer.js">'
		
		 ##@fixAudioScript = @fixImgLinks.gsub('<script type="text/javascript" src="/w/extensions/OggHandler/OggPlayer.js',@audioScript);		
		 
		 @wikibuttons = '<img src="http://' + @lang + '.wikipedia.org/skins-1.5/common/images/'
	
		 @fixButtons = @fixImgLinks.gsub('<img src="/skins-1.5/common/images/',@wikibuttons);
	
		 @content = @fixButtons
		

	 elsif @mode == 'wiktionary'
	
		 @surl = "http://" + @lang +".wiktionary.org/wiki/Special:Search/" + @input
    			 		page = RedirectFollower.new(@surl).resolve

   		
    
   		 puts page.body;
    
   		 @reqUrl = '<a href="http://' + @lang + '.wiktionary.org/wiki/Special:Search'
    
		 @fixImgLinks = page.body.gsub('<a href="/wiki',@reqUrl);
		
		 @wikibuttons = '<img src="http://' + @lang + '.wiktionary.org/skins-1.5/common/images/'
	
		 @fixButtons = @fixImgLinks.gsub('<img src="/skins-1.5/common/images/',@wikibuttons);
	
		 @content = @fixButtons

		
		
		end
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