require 'stomp'
class TestOrbitController < ApplicationController

  def show
      puts "Hello"
      @orbited_js = orbited_javascript
      render :action => "show", :layout => false
  end

  def send_data
    unless params[:chat_input].empty?
      javascript = render_to_string :update do |page|
        page.insert_html :top, 'chat_data', "MESSAGE: #{h     params[:chat_input]}"
        page[:chat_input].clear
        page[:chat_input].focus
      end

      s = Stomp::Client.new
      s.send(params[:channel],params[:chat_input])
      s.close
    end

    render :nothing => true
  end
end
