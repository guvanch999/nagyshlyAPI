//require('dotenv').config();
process.env.TOKEN_KEY='aktayapicreatedbyalfalabs';
ServerSettings={
    user: 'userforaktay',
  host: 'localhost',
  database: 'dbforaktay',
  password: 'fib11235',
  port: '5432',
}
console.log(ServerSettings);
module.exports=ServerSettings

