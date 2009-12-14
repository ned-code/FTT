class DatastoreEntriesController < ApplicationController
  def index
    render :text => 'ds index'
  end
  def create
    render :text => 'ds create'
  end
  def show
    render :text => 'ds show'
  end
  def update
    render :text => 'ds update'
  end
  def destroy
    render :text => 'ds destroy'
  end
end
