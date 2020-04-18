# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
memories = [{ title:'Factfullness Book', start_date: (Date.today - 50)}, 
            {title: 'Visual Studio Code Shortcuts', start_date: (Date.today - 25)}, 
            {title: 'Central American Capitals', start_date: (Date.today - 3)}]


memories.each do |mem|
  memory = Memory.create(title: mem[:title], start_date: mem[:start_date])
  memory.create_recall_events
end