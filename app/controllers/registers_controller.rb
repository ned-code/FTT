class RegistersController < ApplicationController
  skip_before_filter :authenticate_user!
  
  def create
    @register = Register.new(params[:register])
    if @register.save
      redirect_to root_url(:register => 1)
    else
      redirect_to root_url(:register => 1)
    end
  end
end
