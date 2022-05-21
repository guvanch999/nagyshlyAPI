const express=require("express");
const pool=require('./db/db');
const corsRequired=require('cors');
const heltet=require('helmet');

//dotenv.config();
const port=process.env.PORT||3030;

const app=express();
app.use(corsRequired());
app.use(heltet());
//app.use(morgan('combined'));
require('./midlewares/midlewares')(app);
require('./routers/index')(app);
app.use('/uploads',express.static(__dirname+'/uploads'));

async function resetfunction(){

   await pool.query('select now()', async (err,result)=>{
      if(err){
         throw err;
      }
      console.log("database is ok");
      app.listen(port,()=>{
         console.log("server stardet at "+port);

      });

      })
}

resetfunction();
