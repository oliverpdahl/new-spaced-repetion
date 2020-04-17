class MemoriesController < ApplicationController
  def index
    render json: Memory.all
  end
end
