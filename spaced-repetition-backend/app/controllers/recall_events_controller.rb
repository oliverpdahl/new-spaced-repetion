class RecallEventsController < ApplicationController
  def update
    recall_event = RecallEvent.find(params[:id])
    new_status = {id: params[:id], complete: !recall_event.complete}
    recall_event.update(new_status)
    render json: recall_event
  end
end
