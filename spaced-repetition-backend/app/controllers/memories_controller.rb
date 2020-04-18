class MemoriesController < ApplicationController
  def index
    render json: Memory.all, include: [:recall_events]
  end

  def create 
    memory = Memory.create(title: params['title'], strategy: params['strategy'], category: params['category'])
    memory.create_recall_events
    render json: memory, include: [:recall_events]
  end

  def destroy 
    Memory.find(params['id']).destroy
  end
end
