class RecallEvent < ApplicationRecord
  belongs_to :memory
  class_attribute :scheduled_date, default: set_scheduled_date

  def set_scheduled_date
    memory.start_date + daysDistant
  end
end
