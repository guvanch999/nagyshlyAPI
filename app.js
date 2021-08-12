const express=require("express");

const app=express();

app.get("/",(req,res)=>{
   res.contentType('application/json');
   res.json({message:'It is success!'});
   res.end();
})
app.listen(8080,()=>{
   console.log("server stardet");

})