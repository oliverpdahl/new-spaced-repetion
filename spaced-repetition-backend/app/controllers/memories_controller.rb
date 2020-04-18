class MemoriesController < ApplicationController
  def index
    render json: Memory.all
  end

  def create 
    memory = Memory.create(title: params['title'])
    render json: memory
  end

  def destroy 
    Memory.find(params['id']).destroy
  end
end
