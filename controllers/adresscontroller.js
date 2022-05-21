const pool = require('../db/db');
const e = require('../utils/e');
const queries = require('../sqlqueries/addressqueries');

var createadress=async (req,res)=>{
      var _adress=req.body.adress;
      if(!_adress) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.INSERTNEWADDRESS,[req.user.user_id,_adress],async (err,result)=>{
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg:  e.MsgTmFlags.INTERNAL_SERVER_ERROR ,
                  });
            }
            return res.status(200).json({
                  success:true,
                  data:result.rows[0]
            });
      });
}
var getUserAdresess=async (req,res)=>{
      await pool.query(queries.GETADRESESOFUSER,[req.user.user_id],async (err,result)=>{
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg:  e.MsgTmFlags.INTERNAL_SERVER_ERROR ,
                  });
            }
            return res.status(200).json({
                  success:true,
                  adreses:result.rows
            });
      });
}
var updateAdress=async (req,res)=>{
      var _adress=req.body.adress;
      var _id=req.params.id;
      if(!_id || !_adress){
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.UPDATEADRESS,[_id,_adress],async (err,result)=>{
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg:  e.MsgTmFlags.INTERNAL_SERVER_ERROR ,
                  });
            }
            return res.status(200).json({
                  success:true
            });
      });
}
var deleteadress=async (req,res)=>{
      var _id=req.params.id;
      if(!_id) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.GETFORCHECK,[_id],async (err,result)=>{
            if(err){
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg:  e.MsgTmFlags.INTERNAL_SERVER_ERROR ,
            });
            }
            if(result.rowCount===0){
                  return res.status(400).json({
                        success: false,
                        msg:  e.MsgTmFlags.INTERNAL_SERVER_ERROR ,
                  });
            }
            await pool.query(queries.DELETEADRESS,[_id],(derr)=>{
                  if(derr){
                        console.log(derr);
                        return res.status(400).json({
                              success: false,
                              msg:  e.MsgTmFlags.INTERNAL_SERVER_ERROR ,
                        });
                  }
                  return res.status(200).json({
                        success:true
                  })
            })
      });
}

module.exports = {
      createadress,
      getUserAdresess,
      updateAdress,
      deleteadress
}