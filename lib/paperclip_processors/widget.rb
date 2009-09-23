require 'zip/zip'

module Paperclip

  class Widget < Processor
    attr_accessor :file, :options, :attachment

    def initialize file, options = {}, attachment = nil
      # super
      @file = file
      @options = options
      @attachment = attachment
    end

    def make
      Zip::ZipFile.open(@file.path) do |zip_file|
        zip_file.each do |file|
          return file.get_input_stream.read if file.name == @options[:name]
        end
      end
    end
    
  end
  
end