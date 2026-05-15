import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'meditrack.db');

let db = null;

class Statement {
  constructor(sqlDb, sql) {
    this.sqlDb = sqlDb;
    this.sql = sql;
  }

  get(...params) {
    const stmt = this.sqlDb.prepare(this.sql);
    stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return undefined;
  }

  all(...params) {
    const stmt = this.sqlDb.prepare(this.sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }

  run(...params) {
    const stmt = this.sqlDb.prepare(this.sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    const changes = this.sqlDb.getRowsModified();
    return { changes, lastInsertRowid: this.getLastId() };
  }

  getLastId() {
    const result = this.sqlDb.exec('SELECT last_insert_rowid() as id');
    return result[0]?.values[0]?.[0];
  }
}

const dbProxy = {
  prepare: (sql) => new Statement(db, sql),
  exec: (sql) => db.exec(sql),
  run: (sql, params = {}) => {
    const stmt = db.prepare(sql);
    stmt.bind(Object.values(params));
    stmt.step();
    stmt.free();
    return { changes: db.getRowsModified() };
  },
  save: () => {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  },
};

export const initDb = async () => {
  // Load sql.js WASM
  const SQL = await initSqlJs();

  // Load existing DB or create new
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  dbProxy.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'assistant',
      nom TEXT DEFAULT '',
      prenom TEXT DEFAULT '',
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      date_naissance TEXT,
      sexe TEXT,
      telephone TEXT,
      telephone_secondaire TEXT DEFAULT '',
      lieu TEXT,
      profession TEXT DEFAULT '',
      groupe_sanguin TEXT,
      allergies TEXT DEFAULT '',
      antecedents TEXT DEFAULT '',
      statut TEXT DEFAULT 'Actif',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      motif TEXT,
      symptomes TEXT DEFAULT '',
      diagnostic TEXT,
      traitement TEXT DEFAULT '',
      examens TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      prochain_rendez_vous TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      heure TEXT NOT NULL,
      motif TEXT,
      status TEXT DEFAULT 'planifie',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      related_id INTEGER,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id INTEGER,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: add email column for existing databases
  try {
    db.run('ALTER TABLE users ADD COLUMN email TEXT');
  } catch (e) {
    console.log('Migration note: email column may already exist —', e.message);
  }

  dbProxy.save();
  return dbProxy;
};

export default dbProxy;
