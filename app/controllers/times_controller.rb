class TimesController < ApplicationController
  permit 'registered'

  def show
    @current_time = Time.now.utc

    respond_to do |format|
      format.xml
    end
  end
end
