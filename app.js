const express=require("express");
const pool=require('./db/db');
const cors=require('cors');
const heltet=require('helmet');
const  morgan=require('morgan');


dotenv.config();
const port=process.env.PORT||8080;

const app=express();
app.use(cors());
app.use(heltet());
app.use(morgan('combined'));
require('./midlewares/midlewares')(app);
require('./routers/index')(app);


async function resetfunction(){

   await pool.query('select now()',(err,result)=>{
      if(err){
         throw err;
      }
      //console.log("database is ok");
      app.listen(port,()=>{
         console.log("server stardet at "+port);
      
      });
      
      })
   
}

resetfunction();
