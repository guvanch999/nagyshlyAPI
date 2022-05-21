const Pool = require('pg').Pool;
const Serversettings = require('../configurations');

const connectionString = `postgresql://${Serversettings.user}:${ServerSettings.password}@${ServerSettings.host}:${ServerSettings.port}/${ServerSettings.database}`;
const pool = new Pool({
  connectionString:connectionString,

});

module.exports=pool;
