const express=require("express");
const pool=require('./db/db');
const cors=require('cors');
const heltet=require('helmet');
const  morgan=require('morgan');
//const  dotenv=require('dotenv');
var fs = require('fs');



dotenv.config();
const port=process.env.PORT||3000;

const app=express();
app.use(cors());
app.use(heltet());
app.use(morgan('combined'));
require('./midlewares/midlewares')(app);
require('./routers/index')(app);


async function resetfunction(){

   await pool.query('select now()', async (err,result)=>{
      if(err){
         throw err;
      }
      try{
         var resss=await pool.query("select count(*) from information_schema.tables where table_schema ='public';");
         //console.log(r
         if(resss.rows[0].count<3){

            var sql = await fs.readFileSync('sql.txt').toString();
            await pool.query(sql);
         }
      }catch (err){
         throw err;
      }

      console.log("database is ok");
      app.listen(port,()=>{
         console.log("server stardet at "+port);
      
      });
      
      })
}

resetfunction();
