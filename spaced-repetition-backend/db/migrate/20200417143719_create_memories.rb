class CreateMemories < ActiveRecord::Migration[6.0]
  def change
    create_table :memories do |t|
      t.string :title
      t.string :scheduleKey, default: Memory.first_key_of_schedules
      t.timestamps
    end
  end
end
