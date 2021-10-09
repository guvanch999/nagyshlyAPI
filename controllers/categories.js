const e = require('../utils/e');
const Resize = require('../midlewares/Resize');
const queries = require('../sqlqueries/categories');
const pool = require('../db/db');
const functions = require('../utils/functions');
const productqueries = require('../sqlqueries/productqueries');

var addcategory = async (req, res) => {
      const imagePath = 'categoryimages';
      const tkm_name = req.body.tm_name;
      const rus_name = req.body.ru_name;
      if (!tkm_name || !rus_name) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      if (!req.file) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == "tm" ? e.MsgTmFlags.ERROR_UPLOAD_SAVE_IMAGE_FAIL : e.MsgRuFlags.ERROR_UPLOAD_SAVE_IMAGE_FAIL
            });
      }
      var extention = "" + req.file.originalname;

      extention = extention.slice(extention.lastIndexOf('.'));
      const fileUpload = new Resize(imagePath, Date.now() + extention);
      await fileUpload.save(req.file.buffer);

      //const image_url=req.protocol + '://' + req.get('host')+"/"+fileUpload.fileURL();
      const image_url = fileUpload.fileURL();

      try {

            var result = await pool.query(queries.INSERTCATEGORY, [image_url, tkm_name, rus_name]);
            return res.status(200).json({
                  success: true,
                  data: result.rows[0]
            });

      } catch (err) {
            console.log(err);
            await functions.deleteServerFilePath(image_url, 0);
            return res.status(500).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
            });
      }

}
var getAllCategories = async (req, res) => {
      if (!req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgRuFlags.INVALID_PARAMS
            });
      }
      try {
            var result = await pool.query(queries.SELECTALL(req.header('language') + "_name"));
            return res.status(200).json({
                  success: true,
                  count: result.rowCount,
                  data: result.rows
            });

      }
      catch (err) {
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }

}
var getCategoryByID = async (req, res) => {
      const _id = req.params.id;
      if (!_id || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      var result;
      try {
            result = await pool.query(queries.SELECTBYID(req.header('language') + "_name"), [_id]);
            if (!result.rowCount || result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            return res.status(200).json({
                  success: true,
                  data: result.rows[0]
            });
      } catch (err) {
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }


}
var searchcategrory=async (req,res)=>{
      var _searchtext=req.body.searchtext||"";

      if (!req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.SELECTBYSEARCHTEXT(req.header('language')),[_searchtext],(err,result)=>{
            if(err){
                  console.log(err);
                  return res.status(500).json({
                        success:false,
                        message:req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            return res.status(200).json({
                  success:true,
                  data:result.rows
            });
      });
}
var updateCategory = async (req, res) => {

      const _id = req.body.id;
      const _tm_name = req.body.tm_name;
      const _ru_name = req.body.ru_name;
      if (!_id || !_tm_name || !_ru_name || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });

      }
      var result;
      try {
            result = await pool.query(queries.GETCATEGORYBYID, [_id]);
            if (!result.rowCount || result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            const imagePath = 'categoryimages';
            if (!req.file) {
                  result = await pool.query(queries.UPDATECATEGORY, [_id, _tm_name, _ru_name]);
                  return res.status(200).json({
                        success: true,
                        data: result.rows[0]
                  });
            } else {
                  var del = await functions.deleteServerFilePath(result.rows[0].image_url, 0);
                  var extention = "" + req.file.originalname;

                  extention = extention.slice(extention.lastIndexOf('.'));

                  const fileUpload = new Resize(imagePath, Date.now() + extention);
                  const filename = await fileUpload.save(req.file.buffer);

                  const image_url = fileUpload.fileURL();
                  result = await pool.query(queries.UPDATEWITHIMAGE, [_id, image_url, _tm_name, _ru_name]);
                  return res.status(200).json({
                        success: true,
                        data: result.rows[0]
                  });
            }
      }
      catch (err) {
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }


}
var deleteCategory = async (req, res) => {
      const _id = req.params.id;
      if (!_id || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      var result;
      try {
            var image_url;
            result = await pool.query(queries.GETCATEGORYBYID, [_id]);
            if (!result.rowCount || result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            image_url = result.rows[0].image_url;
            result = await pool.query(queries.GETPRODUCTIDS, [_id]);

            var arr = [0];
            var data = result.rows;
            for (var i = 0; i < data.length; i++)
            {
                  await deletefiles(data[i].id);
            }
            
            result = await pool.query(queries.DELETECAT, [_id]);
            return res.status(200).json({
                  success: true,
            });
      } catch (err) {
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
}
var getcategoriesadmin = async (req, res) => {
      await pool.query(queries.GETCATEGORYDATASFORADMIN, (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                  });
            }
            res.status(200).json({
                  success: true,
                  data: result.rows
            });
      });
}
async function deletefiles(index) {
      await pool.query(productqueries.GETFORCHECK, [index], async (err, result) => {
            if (err) {
                  console.log(err);
                  return;
            }
            if (!result.rowCount) {
                  return;
            }

            await functions.deleteServerFilePath(result.rows[0].image_url, 0);

            await pool.query(productqueries.GETPRODUCTIMAGES, [index], async (error, resultdata) => {
                  if (error) {
                        console.log(error);
                        return;
                  }
                  for (var i = 0; i < resultdata.rowCount; i++) {
                        await functions.deleteServerFilePath(resultdata.rows[i].url, 0);
                  }
                  await pool.query(productqueries.DELETEALLPRODUCTIMAGE, [index], async (err1, result1) => {
                        if (err) {
                              console.log(err);
                              return;
                        }
                        await pool.query(productqueries.DELETEPRODUCT, [index], async (err, result) => {
                              if (err) {
                                    console.log(err);
                                    return;
                              }
                              await pool.query(productqueries.GETPRODYCTDISCOUNTS, [index], async (err11, result11) => {
                                    if (!err11) {
                                          for (var i = 0; i < result11.rowCount; i++) {
                                                await functions.deleteServerFilePath(result11.rows[i].image_url, 0);
                                          }
                                    }
                                    await pool.query(productqueries.DELETEPRODUCTDISCOUNTS, [index], (dperr, dpresult) => {
                                          if (dperr) {
                                                console.log(dperr);
                                                return;
                                          }
                                          return;
                                    });
                              });
                        });
                  });
            });
      });
}
var getbanners=async (req,res)=>{
      if(!req.header('language')){
            return res.status(400).json({
                  success:false,
                  message:e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.getbanners,(err,result)=>{
            if(err){
                  console.log(err);
                  return res.status(500).json({
                        success:false,
                        message:req.header('language')=='tm'?e.MsgTmFlags.INTERNAL_SERVER_ERROR:e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            return res.status(200).json({
                  success:true,
                  data:result.rows
            });
      })
}
var addbanners=async (req,res)=>{
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
      fileUpload.setparams(500,250);
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
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
            });
      }

}
var deletebanner=async (req,res)=>{
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
            if(result.rowCount==0){
                  return res.status(400).json({
                        success:false,
                        message:e.MsgTmFlags.INVALID_PARAMS
                  });
            }
            await functions.deleteServerFilePath(result.rows[0].image_url, 0);
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

module.exports = {
      addcategory,
      getAllCategories,
      updateCategory,
      deleteCategory,
      getCategoryByID,
      getcategoriesadmin,
      searchcategrory,
      getbanners,
      addbanners,
      deletebanner
}