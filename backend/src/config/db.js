const knex = require("knex");
const env = require("./env");

const db = knex({
  client: "mysql2",
  connection: {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    ssl: env.db.ssl ? { rejectUnauthorized: env.db.sslRejectUnauthorized } : undefined
  },
  pool: { min: 2, max: 10 }
});

module.exports = db;
