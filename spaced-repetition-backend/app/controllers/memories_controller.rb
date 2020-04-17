class MemoriesController < ApplicationController
  def index
    render json: Memory.all
  end

  def create 
    memory = Memory.create(title: params['title'])
    render json: memory
  end
end
