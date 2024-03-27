// Require SQLite3 verbose module
const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database, and if it doesn't exist, create it
const db = new sqlite3.Database(
  "./db.sqlite",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    // Error handling for connection
    if (err) {
      return console.error(err.message);
    } else {
      // Success message for successful connection
      console.log("Connected to the SQLite database.");
    }
  }
);

// Serialize runs to ensure sequential execution
db.serialize(() => {
  // Run SQL command to create table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS goodwill (
            id INTEGER PRIMARY KEY,
            name TEXT,
            message TEXT,
            appreciation TEXT,
            ref TEXT,
            code TEXT,
            redeemed INTEGER DEFAULT 0,
            approved INTEGER DEFAULT 0,
            expires_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
    (err) => {
      // Error handling for table creation
      if (err) {
        return console.error(err.message);
      }
      console.log("Created goodwill table");

      const date = new Date()

      // Run SQL command to delete items in goodwill table
      db.run(`DELETE FROM goodwill`, (err) => {
        // Error handling for deletion
        if (err) {
          return console.error(err.message);
        }
        console.log("Deleted items in goodwill table");

        // Sample values for insertion
        const value1 = [
          "Alice",
          "You are amazing!",
          "buy-you-a-coffee",
          "001",
          "3j3a93",
          0,
          date.setDate(date.getDate() + 1),
        ];
        const value2 = [
          "Bob",
          "You are awesome!",
          "buy-you-a-coffee",
          "002",
          "3j3a93",
          0,
          date.setDate(date.getDate() + 1),
        ];
        const value3 = [
          "Charlie",
          "You are wonderful!",
          "buy-you-a-coffee",
          "003",
          "3j3a93",
          0,
          date.setDate(date.getDate() + 1),
        ];

        // SQL command for insertion
        const insertSql = `INSERT INTO goodwill (name, message, appreciation, ref, code, redeemed, expires_at) VALUES (?,?,?,?,?,?,?)`;

        // Execute insert commands for each value
        db.run(insertSql, value1, (err) => {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID;
          console.log(`Added goodwill item with id ${id}`);
        });

        db.run(insertSql, value2, (err) => {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID;
          console.log(`Added goodwill item with id ${id}`);
        });
        db.run(insertSql, value3, (err) => {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID;
          console.log(`Added goodwill item with id ${id}`);
        });

        // Close the database connection
        db.close((err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Closed the database connection.");
        });
      });
    }
  );
});
