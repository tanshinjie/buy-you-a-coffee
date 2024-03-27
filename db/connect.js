import sqlite3 from "sqlite3"
import { open } from "sqlite"

// Open SQLite database connection
export async function openDb() {
  return open({
    filename: './db.sqlite',
    driver: sqlite3.Database
  })  
}