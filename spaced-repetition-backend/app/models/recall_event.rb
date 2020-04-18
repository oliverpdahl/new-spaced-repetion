class RecallEvent < ApplicationRecord
  belongs_to :memory
  after_create :set_scheduled_date

  def set_scheduled_date
    scheduled_date = memory.start_date + daysDistant
  end
end
