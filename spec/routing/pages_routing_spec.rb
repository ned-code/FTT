require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe PagesController do

  before(:all) do
    @document_uuid = UUID.generate
    @page_uuid     = UUID.generate
  end

#  it { should route :get,     '/pages',    :controller => :pages, :action => :index             }
#  it { should route :post,    '/pages',    :controller => :pages, :action => :create            }
  it('') { should route :get,     '/documents/1/pages/2',                             :controller => :pages,  :action => :show, :document_id => 1,              :id => 2           }
  it('') { should route :get,     "/documents/#{@document_uuid}/pages/#{@page_uuid}", :controller => :pages,  :action => :show, :document_id => @document_uuid, :id => @page_uuid  }
#  it { should route :put,     '/pages/1',  :controller => :pages, :action => :update,  :id => 1 }
#  it { should route :delete,  '/pages/1',  :controller => :pages, :action => :destroy, :id => 1 }

end
