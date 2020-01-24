const LocalSession = require('telegraf-session-local')

module.exports = { 
    localSession : new LocalSession({
        // Database name/path, where sessions will be located (default: 'sessions.json')
        database: 'yes_db.json',
        // Name of session property object in Telegraf Context (default: 'session')
        property: 'session',
        // Type of lowdb storage (default: 'storageFileSync')
        storage: LocalSession.storageFileAsync,
        // Format of storage/database (default: JSON.stringify / JSON.parse)
        format: {
          serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
          deserialize: (str) => JSON.parse(str),
        },
        // We will use `messages` array in our database to store user messages using exported lowdb instance from LocalSession via Telegraf Context
        state: { users: [], employees: [], employers: [], jobs: [] }
      })
};