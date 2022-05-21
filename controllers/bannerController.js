const e = require("../utils/e");
const pool = require("../db/db");
const queries = require("../sqlqueries/bannerQueries");
const Resize = require("../midlewares/Resize");
const functions = require("../utils/functions");
module.exports = {
     getbanners:async (req,res)=>{
        await pool.query(queries.getbanners,(err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:false,
                    message:e.MsgTmFlags.INTERNAL_SERVER_ERROR
                });
            }
            return res.status(200).json({
                success:true,
                data:result.rows
            });
        })
    },
    addbanners:async (req,res)=>{
        if (!req.file) {
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.ERROR_UPLOAD_SAVE_IMAGE_FAIL
            });
        }
        const imagePath = 'bannerimages';
        var extention = "" + req.file.originalname;
        extention = extention.slice(extention.lastIndexOf('.'));
        const fileUpload = new Resize(imagePath, Date.now() + extention);
        fileUpload.setparams(2500,1000);
        await fileUpload.save(req.file.buffer);

        //const image_url=req.protocol + '://' + req.get('host')+"/"+fileUpload.fileURL();
        const image_url = fileUpload.fileURL();

        try {

            var result = await pool.query(queries.setbanner, [image_url]);
            return res.status(200).json({
                success: true,
                data: result.rows[0]
            });

        } catch (err) {
            console.log(err);
            await functions.deleteServerFilePath(image_url, 0);
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }

    },
    deletebanner:async (req,res)=>{
        var _id=req.params.id;
        if(!_id){
            return res.status(400).json({
                success:false,
                message:e.MsgTmFlags.INVALID_PARAMS
            });
        }
        await pool.query(queries.getbannerforcheck,[_id],async (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    success:false,
                    message:e.MsgTmFlags.INTERNAL_SERVER_ERROR
                });
            }
            if(result.rowCount===0){
                return res.status(400).json({
                    success:false,
                    message:e.MsgTmFlags.INVALID_PARAMS
                });
            }
            await functions.deleteServerFilePath(result.rows[0].url, 0);
            await pool.query(queries.deletebanner,[_id],(err1,result1)=>{
                if(err1){
                    console.log(err1);
                    return res.status(500).json({
                        success:false,
                        message:e.MsgTmFlags.INTERNAL_SERVER_ERROR
                    });
                }
                return res.status(200).json({
                    success:true,
                    data:result1.rows[0]
                });
            });
        });
    }
}
