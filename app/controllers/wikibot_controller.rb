
class WikibotController < ActionController::Base

	def search

	require 'net/http'

	@input = params[:input]
	@lang = params[:lang]
	@mode = params[:mode]

	if @mode == 'wiki'
		 @surl = "http://" + @lang +".wikipedia.org/wiki/" + @input

   		 url = URI.parse(@surl)
   		 req = Net::HTTP::Get.new(url.path)
   		 res = Net::HTTP.start(url.host, url.port) {|http|
    	 http.request(req)
    	 }

   		 puts res;
   		 @reqUrl = '<a href="http://' + @lang + '.wikipedia.org/wiki'

		 @fixImgLinks = res.body.gsub('<a href="/wiki',@reqUrl);

		 @wikibuttons = '<img src="http://' + @lang + '.wikipedia.org/skins-1.5/common/images/'

		 @fixButtons = @fixImgLinks.gsub('<img src="/skins-1.5/common/images/',@wikibuttons);

		 @content = @fixButtons


	 elsif @mode == 'wiktionary'

		 @surl = "http://" + @lang +".wiktionary.org/wiki/" + @input

   		 url = URI.parse(@surl)
   		 req = Net::HTTP::Get.new(url.path)
   		 res = Net::HTTP.start(url.host, url.port) {|http|
    	 http.request(req)
    	 }

   		 puts res.body;

   		 @reqUrl = '<a href="http://' + @lang + '.wiktionary.org/wiki'

		 @fixImgLinks = res.body.gsub('<a href="/wiki',@reqUrl);

		 @wikibuttons = '<img src="http://' + @lang + '.wiktionary.org/skins-1.5/common/images/'

		 @fixButtons = @fixImgLinks.gsub('<img src="/skins-1.5/common/images/',@wikibuttons);

		 @content = @fixButtons

		

		end
	end

end
