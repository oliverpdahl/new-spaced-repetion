class CreateRecallEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :recall_events do |t|
      t.references :memory, null: false, foreign_key: true
      t.integer :daysDistant
      t.timestamps
    end
  end
end
