class Memory < ApplicationRecord
  has_many :recall_events, dependent: :destroy

  SHEDULES = {
    superMemo: [1, 7, 16, 35]
  }.freeze

  def create_recall_events
    recall_events << RecallEvent.create
  end

  def self.schedules 
    return SHEDULES
  end
end
