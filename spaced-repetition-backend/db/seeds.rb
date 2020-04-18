# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
factfullness = Memory.create(title: 'Factfullness Book')
factfullness.recall_events << RecallEvent.create()
vscode = Memory.create(title: 'Visual Studio Code Shortcuts')
vscode.recall_events << RecallEvent.create()
centralAmerica = Memory.create(title: 'Central American Capitals')
centralAmerica.recall_events << RecallEvent.create()