class Memory < ApplicationRecord
  has_many :recall_events

  def create_recall_events
    self.recall_events << RecallEvent.create
  end
end
