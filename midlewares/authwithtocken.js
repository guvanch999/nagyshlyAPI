const jwt=require('jsonwebtoken');
const pool=require('../db/db');
const queries =require('../sqlqueries/adminloginqueryes');
const settings=require('../settings/usersettings')
exports.VerifieToken= async (req,res,next)=>{
      const token=req.header('auth-token');
      const admin=req.header('admin')||false;
      if(!token){
            console.log("No token detected")
            return res.status(401).json({
                  success:false,
                  message:"No token detected"
            });
      }
      try{
            const verified=jwt.verify(token,settings.APISECRETKEY);
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
                  console.log("Access Denied");
                  return res.status(401).json({
                        success:false,
                        message:"Access Denied"
                  });
            }
            next();
      }catch(err)
      {
		console.log(err);
            return res.status(500).json({
                  success:false,
                  message:"Internal server error!"
            });
      }
}
