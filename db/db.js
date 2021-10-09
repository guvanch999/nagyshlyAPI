const Pool = require('pg').Pool;
const Serversettings = require('../settings/dbsettings');

const connectionString = `postgresql://${Serversettings.user}:${ServerSettings.password}@${ServerSettings.host}:${ServerSettings.port}/${ServerSettings.database}`;
const pool = new Pool({
  connectionString:connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports=pool;
