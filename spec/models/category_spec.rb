require 'spec_helper'

describe Category do

  describe 'number_of_public_documents method' do
    before do
      @theme = Factory(:theme_without_upload, :is_default => true)
      @category_1 = Factory(:category)
      @category_2 = Factory(:category)
      @document_private = Factory(:document, :is_public => false, :category => @category_1)
      @document_public_1 = Factory(:document, :is_public => true, :category => @category_1)
      @document_public_2 = Factory(:document, :is_public => true, :category => @category_2)
    end

    it "should return the number of the public document" do
      p @category_1.number_of_public_documents

      @category_1.number_of_public_documents.should == 1

    end
  end
  
end



# == Schema Information
#
# Table name: categories
#
#  name :string(255)     not null
#  uuid :string(36)      primary key
#

