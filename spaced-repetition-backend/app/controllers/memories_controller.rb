class MemoriesController < ApplicationController
  def index
    render json: Memory.all
  end

  def create 
    memory = Memory.create(title: params['title'])
    memory.create_recall_events
    render json: memory [:recall_events]
  end

  def destroy 
    Memory.find(params['id']).destroy
  end
end
