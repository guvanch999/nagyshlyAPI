const bodyParser=require('body-parser');
const express=require('express');
const path=require('path');
const logmiddl=require('./logmidll');
module.exports=(app)=>{
  //app.use(bodyparser())
  app.use(bodyParser.json());

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }));
    app.use(
      express.urlencoded({
        extended: true
      })
    )
    app.use(express.static(__dirname))
    app.use(express.json())
    //app.use(express.static(path.join(__dirname, 'uploads')));
    app.use('/uploads', express.static('uploads')); 
      app.use('/',logmiddl.LogFunction);
    
    console.log("midwares is inserted");
    return app;

}