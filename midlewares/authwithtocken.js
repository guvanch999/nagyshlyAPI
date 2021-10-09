const jwt=require('jsonwebtoken');
const pool=require('../db/db');
const queries =require('../sqlqueries/adminloginqueryes');

exports.VerifieToken= async (req,res,next)=>{
      const token=req.header('auth-token');
      const admin=req.header('admin')||false;
      if(!token)return res.status(401).json({
            success:false,
            message:"Access Denied"
      });

      try{
            
            const verified=jwt.verify(token,process.env.TOKEN_KEY);
            req.user=verified;
      }catch(err)
      {
            console.log(err);
            return res.status(401).json({
                  success:false,
                  message:"Invalid token"
            });
      }
      try{
            var que="";
            if(admin)que=queries.CHECKADMIN; else que=queries.CHECKUSER;
            var result = await pool.query(que,[req.user.user_id]);
            if(!result.rowCount){
                  return res.status(401).json({
                        success:false,
                        message:"Access Denied"
                  });
            }
            next();
      }catch(err)
      {
            return res.status(500).json({
                  success:false,
                  message:"Internal server error!"
            });
      }
}