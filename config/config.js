require('dotenv').config()

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": 'postgres',
    "port": process.env.DB_PORT,
    "secret_key": process.env.SECRET_KEY,
  },
  "test": {
    "username": "postgres",
    "password": "user",
    "database": "test_db_migration",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "user",
    "database": "production_db_migration",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
