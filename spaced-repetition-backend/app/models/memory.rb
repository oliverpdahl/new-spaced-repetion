class Memory < ApplicationRecord
  has_many :recall_events, dependent: :destroy

  SHEDULES = {
    super_memo: [1, 7, 16, 35]
  }.freeze

  def create_recall_events
    recall_events << RecallEvent.create
  end

  def self.schedules
    SHEDULES
  end

  def self.first_key_of_schedules
    schedules.first.first.to_s
  end
end
