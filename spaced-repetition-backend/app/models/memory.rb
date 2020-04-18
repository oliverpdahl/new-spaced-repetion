class Memory < ApplicationRecord
  has_many :recall_events, dependent: :destroy

  SHEDULES = {
    super_memo: [1, 7, 16, 35]
  }.freeze

  def create_recall_events
    schedule = self.class.schedules[scheduleKey]
    schedule.each do |days_distant|
      recall_events.build(daysDistant: days_distant)
    end
  end

  def self.schedules
    SHEDULES
  end

  def self.first_key_of_schedules
    schedules.first.first.to_s
  end
end
