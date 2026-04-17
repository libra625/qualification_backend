const config = require('../config/config');

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: `${config.host}`,
    database: `${config.database}`,
    password: `${config.password}`,
    port: `${config.portDb}`,
});

module.exports = pool;
