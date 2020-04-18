# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
memories = [{ title:'Factfullness Book', 
              start_date: (Date.today - 50),
              category: 'Reading',
              strategy: 'Write down the three most important points and then review reading notes'
            }, 
            { title: 'Visual Studio Code Shortcuts', 
              start_date: (Date.today - 25),
              category: 'Shortcuts',
              strategy: `Go through list and first try the action before looking at the command. Practice the ones where you didn't know the command three times`
            }, 
            { title: 'Central American Capitals', 
              start_date: (Date.today - 1),
              category: 'Geography',
              strategy: `Go through quizlet until you get all of them right`
            }]


memories.each do |mem|
  memory = Memory.create(title: mem[:title], start_date: mem[:start_date], category: mem[:category], strategy: mem[:strategy])
  memory.create_recall_events
end