require('dotenv').config();

ServerSettings={
    user: process.env.PGUSERNAME,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGP0RT,
}
console.log(ServerSettings);
module.exports=ServerSettings

