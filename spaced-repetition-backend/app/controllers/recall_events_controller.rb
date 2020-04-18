class RecallEventsController < ApplicationController
  def update
    new_status = {id: params[:id], complete: params[:complete]}
    RecallEvent.find(params[:id]).update(new_status)
  end
end
