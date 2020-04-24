# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_18_113650) do

  create_table "memories", force: :cascade do |t|
    t.string "title"
    t.string "scheduleKey", default: "super_memo"
    t.date "start_date", default: "2020-04-24"
    t.string "strategy"
    t.string "category"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "recall_events", force: :cascade do |t|
    t.integer "memory_id", null: false
    t.integer "daysDistant"
    t.boolean "complete", default: false
    t.date "scheduled_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["memory_id"], name: "index_recall_events_on_memory_id"
  end

  add_foreign_key "recall_events", "memories"
end
