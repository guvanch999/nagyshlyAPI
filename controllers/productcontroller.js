const e = require('../utils/e');
const pool = require('../db/db');
const productqueries = require('../sqlqueries/productqueries');
const utils = require('../utils/functions');
const Resize = require('../midlewares/Resize');
const url = require('url');

async function roundproductcount(_id) {
      await pool.query(productqueries.ROUNDCOUNT, [_id, _id], (err1, result1) => {
            if (err1) {
                  console.log(err1);
            }
      });
}
var getBigImages=async (req,res)=>{
      var _id=req.params.id;
      if(!_id){
            return res.status(400).json({
                  success:false,
                  message:req.header('language')==='ru'?e.MsgRuFlags.INVALID_PARAMS:e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(productqueries.GETPRODUCTIMAGES,[_id],(err,result)=>{
            if(err){
                  console.log(err);
                  return res.status(500).json({
                        success:false,
                        message:req.header('language')==='ru'?e.MsgRuFlags.INTERNAL_SERVER_ERROR:e.MsgTmFlags.INTERNAL_SERVER_ERROR
                  })
            };
            var image_array=[];
            result.rows.forEach((elemet)=>{
                  image_array.push(elemet.url);
            })

            return res.status(200).json({
                  success:true,
                  data:image_array
            });
      });
}
var getallProducts = async (req, res) => {
      var _id = req.params.id;
      var url_parts = url.parse(req.url, true).query;
      var _pages = url_parts.pages;
      var _skip = (_pages - 1) * 10;

      if (!_pages || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') === "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
     if(_id==undefined){
           return res.status(400).json({
                 success: false,
                 message: req.header('language') === "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
           });
     }
     if(_id==0){
           await pool.query(productqueries.GETALLDISQOUNTPROD, [_skip], (err, result) => {
                 if (err) {
                       console.log(err);
                       return res.status(500).json({
                             success: false,
                             message: req.header('language') == "tm" ? e.MsgTmFlags.ERROR : e.MsgRuFlags.ERROR
                       });
                 }
                 else {
                       return res.status(200).json({
                             success: true,
                             data: result.rows
                       });
                 }
           });
     } else {
           await pool.query(productqueries.GETALLPRODUCTS(req.header('language')), [_id, _skip], (err, result) => {
                 if (err) {
                       console.log(err);
                       return res.status(500).json({
                             success: false,
                             message: req.header('language') == "tm" ? e.MsgTmFlags.ERROR : e.MsgRuFlags.ERROR
                       });

                 } else {
                       return res.status(200).json({
                             success: true,
                             data: result.rows
                       });
                 }
           });
     }
}
var getbyseearchtext=async (req,res)=>{
      var _searchtext = req.body.searchtext || "";
      var url_parts = url.parse(req.url, true).query;
      var _pages = url_parts.page;
      var _skip = (_pages - 1) * 10;
      //console.log(_searchtext);
      if ( !_pages || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(productqueries.GETBYSEARHTEXT,[_searchtext,_skip],(err,result)=>{
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            return res.status(200).json({
                  success: true,
                  data: result.rows
            });
      });
}

var getFavorits = async (req, res) => {
      var _favorit_ids = req.body.ids || [0];
      var url_parts = url.parse(req.url, true).query;
      var _pages = url_parts.page;
      var _skip = (_pages - 1) * 10;
      if ( !_pages || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      if (!Array.isArray(_favorit_ids)) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      if (_favorit_ids.length == 0) {
            return res.status(200).json({
                  success: true,
                  data: []
            });
      }

      await pool.query(productqueries.GETFAVORITEPRODUCTS(_favorit_ids), [_skip], (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            return res.status(200).json({
                  success: true,
                  data: result.rows
            });

      })

}

var getProductByID = async (req, res) => {
      var _id = req.params.id;
      if (!_id || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') === "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(productqueries.GETPRODUCTBYID(req.header('language')), [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') === "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }
            try {
                  var image_result = await pool.query(productqueries.GETPRODUCTIMAGES, [_id]);
                  var color_result = await pool.query(productqueries.GETPRODUCTCOLORS(req.header('language')), [_id]);
                  var size = await pool.query(productqueries.GETSIZES([_id]));
                  var image_array=[];
                  image_result.rows.forEach((elemet)=>{
                        image_array.push(elemet.url);
                  })
                  return res.status(200).json({
                        success: true,
                        description: result.rows[0].description,
                        images: image_result.rows,
                        bitgimages:image_array,
                        colors: color_result.rows,
                        size: size.rows
                  });
            } catch (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }

      });
}



var getSortedProducts = async (req, res) => {
      var _catid = req.params.cid;
      var _sortid = req.params.sid;
      var url_parts = url.parse(req.url, true).query;
      var _page = url_parts.page;
      var _skip = (_page - 1) * 10;
      //console.log(_sortid,' ',typeof _sortid);
      //console.log(req.body);
      if (!req.header('language')) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      if (_catid==undefined) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      if (_sortid > 3 || _sortid < 0) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETSORTPRODUCTS(req.body, _sortid,_catid), [_skip], (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.ERROR : e.MsgRuFlags.ERROR
                  });
            }
            else {
                  return res.status(200).json({
                        success: true,
                        data: result.rows
                  });
            }
      });
}
var getFilterParametres = async (req, res) => {
      var _categoryid = req.params.cid;
      if (_categoryid==undefined) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETPRODUCTIDS(_categoryid), async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            if(result.rowCount==0){
                  return res.status(200).json({
                        "success": true,
                        "maxprice": 0,
                        "minprice": 0,
                        "size": [],
                        "colors": []
                  });
            }
            var product_ids = [0];
            result.rows.forEach(element => {
                  product_ids.push(element.id);
            });

            try {
                  var minmaxresult = await pool.query(productqueries.GETMINANDMAXPRICE(_categoryid));
                  var size = await pool.query(productqueries.GETSIZES(product_ids));
                  var colors = await pool.query(productqueries.GETCOLORS(req.header('language'), product_ids));
                  return res.status(200).json({
                        success: true,
                        maxprice: minmaxresult.rows[0].maxprice,
                        minprice: minmaxresult.rows[0].minprice,
                        size: size.rows,
                        colors: colors.rows
                  });
            } catch (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
      });
}



var createProduct = async (req, res) => {
      const imagePath = 'productimages';
      var verif = utils.verifieproductbody(req);

      if (!verif) {
            console.log(req.body);
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
      //console.log(typeof(extention));
      extention = extention.slice(extention.lastIndexOf('.'));
      const fileUpload = new Resize(imagePath, Date.now() + extention);
      const filename = await fileUpload.save(req.file.buffer);

      const image_url = fileUpload.fileURL();

      verif.push(image_url);
      //const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
      await pool.query(productqueries.INSERTPRODUCT, verif, async (err, result) => {
            if (err) {
                  await utils.deleteServerFilePath(image_url, 0);
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            } else {
                  return res.status(200).json({
                        success: true,
                        data: result.rows[0]
                  });
            }
      });

}
var updateproductdatas = async (req, res) => {
      const imagePath = 'productimages';
      var _id = req.body.id;
      var verif = utils.verifieproductbody(req);
      if (!verif || !_id) {
            console.log(req.body);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            var image_url = result.rows[0].image_url;
            if (req.file) {
                  var extention = "" + req.file.originalname;
                  extention = extention.slice(extention.lastIndexOf('.'));
                  const fileUpload = new Resize(imagePath, Date.now() + extention);
                  const filename = await fileUpload.save(req.file.buffer);
                  image_url = fileUpload.fileURL();
            }
            verif.push(image_url);
            verif.push(_id);
            await pool.query(productqueries.UPDATEPRODUCT, verif, async (inserr, insres) => {
                  if (inserr) {
                        console.log(inserr);
                        if (req.file) {
                              await utils.deleteServerFilePath(image_url, 0);
                        }
                        return res.status(400).json({
                              success: false,
                              msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                        });
                  }
                  if (req.file) {
                        await utils.deleteServerFilePath(result.rows[0].image_url, 0);
                  }

                  return res.status(200).json({
                        success: true,
                  });
            });
      });
}

var addimagetoproduct = async (req, res) => {
      const _id = req.body.id;
      if (!_id || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      if (!req.file) {

            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.ERROR_IMAGE_DOES_NOT_EXISTS : e.MsgRuFlags.ERROR_IMAGE_DOES_NOT_EXISTS
            });
      }
      const imagePath = 'productimagelist';
      await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }
            if (!result.rowCount) {
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }
            var extention = "" + req.file.originalname;
            //console.log(typeof(extention));
            extention = extention.slice(extention.lastIndexOf('.'));
            const fileUpload = new Resize(imagePath, Date.now() + extention);
            fileUpload.setparams(500, 500);
            const filename = await fileUpload.save(req.file.buffer);

            const image_url = fileUpload.fileURL();
            const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
            await pool.query(productqueries.INSERTPRODUCTIMAGE, [_id, image_url], async (errq, resultdata) => {
                  if (errq) {
                        console.log(errq);
                        await utils.deleteServerFilePath(image_url, 0);
                        return res.status(500).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  return res.status(200).json({
                        success: true,

                  });
            });

      });
}
var deleteproductimage = async (req, res) => {
      const _id = req.params.id;
      if (!_id || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(productqueries.GETPRODUCTIMAGEBYID, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            if (!result.rowCount) {
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }

            await pool.query(productqueries.DELETEPRODUCTIMAGE, [_id], async (err, result2) => {
                  if (err) {
                        console.log(err);
                        return res.status(500).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  await utils.deleteServerFilePath(result.rows[0].url, 0);
                  return res.status(200).json({
                        success: true,
                  });
            });

      });

}


var deleteProduct = async (req, res) => {
      const _id = req.params.id;
      const imagePath = 'productimages';
      if (!_id) {
            // console.log(req.body);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }
            if (!result.rowCount) {
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }

            const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
            await utils.deleteServerFilePath(result.rows[0].image_url, 0);

            await pool.query(productqueries.GETPRODUCTIMAGES, [_id], async (error, resultdata) => {
                  if (error) {
                        console.log(error);
                        return res.status(400).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  for (var i = 0; i < resultdata.rowCount; i++) {
                        await utils.deleteServerFilePath(resultdata.rows[i].url, 0);
                  }
                  await pool.query(productqueries.DELETEALLPRODUCTIMAGE, [_id], async (err1, result1) => {
                        if (err) {
                              console.log(err);
                              return res.status(500).json({
                                    success: false,
                                    message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                              });
                        }
                        await pool.query(productqueries.DELETEPRODUCT, [_id], async (err, result) => {
                              if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                          success: false,
                                          message: req.header('language') == "tm" ? e.MsgTmFlags.ERROR : e.MsgRuFlags.ERROR
                                    });
                              }
                              await pool.query(productqueries.GETPRODYCTDISCOUNTS, [_id], async (err11, result11) => {
                                    if (!err11) {
                                          for (var i = 0; i < result11.rowCount; i++) {
                                                await utils.deleteServerFilePath(result11.rows[i].image_url, 0);
                                          }
                                    }
                                    await pool.query(productqueries.DELETEPRODUCTDISCOUNTS, [_id], (dperr, dpresult) => {
                                          if (dperr) {
                                                console.log(dperr);
                                                return res.status(500).json({
                                                      success: false,
                                                      message: req.header('language') == "tm" ? e.MsgTmFlags.ERROR : e.MsgRuFlags.ERROR
                                                });
                                          }
                                          return res.status(200).json({
                                                success: true,
                                          });
                                    });
                              });


                        });
                  });
            });
      });

}

var addProductDiscount = async (req, res) => {
      const _id = req.body.id;
      const _color_id = req.body.color_id;
      const _size = req.body.size;
      const _discount = req.body.discount;

      console.log(req.body);
      if (!_id || !req.header('language')) {
            console.log(req.body);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      if (_color_id == undefined || _size == undefined || _discount == undefined) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETFORCHECK, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }
            var image_url = "";
            if (req.file) {
                  const imagePath = 'productcoloredimage';
                  var extention = "" + req.file.originalname;
                  //console.log(typeof(extention));
                  extention = extention.slice(extention.lastIndexOf('.'));
                  const fileUpload = new Resize(imagePath, Date.now() + extention);
                  fileUpload.setparams(100, 100);
                  const filename = await fileUpload.save(req.file.buffer);
                  image_url = fileUpload.fileURL();
                  console.log("file true");
                  console.log(image_url);
            } else {
                  console.log("file false");
                  image_url = "";
            }
            const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
            await pool.query(productqueries.INSERTPRODUCTDISCOUNTS, [_id, _color_id, _size, _discount, image_url], async (inserterr, insertresult) => {
                  if (inserterr) {
                        console.log(inserterr);
                        if (image_url != "") await utils.deleteServerFilePath(image_url, 0);
                        return res.status(500).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  await roundproductcount(_id);
                  return res.status(200).json({
                        success: true,
                  });
            });

      });

}
var deleteProductDiscount = async (req, res) => {
      var _id = req.params.id;
      if (!_id || !req.header('language')) {
            // console.log(req.body);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETPRODUCTDISCOUNTBYID, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
            await utils.deleteServerFilePath(result.rows[0].image_url, 0);
            await pool.query(productqueries.DELETEPRODUCTDISCOUNTSBYID, [_id], async (delerr, delres) => {
                  if (delerr) {
                        console.log(err);
                        return res.status(500).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  await roundproductcount(delres.rows[0].prod_id);
                  return res.status(200).json({
                        success: true,

                  });
            })

      })

}

var getproductsadmin = async (req, res) => {
      var url_parts = url.parse(req.url, true).query;
      var _pages = url_parts.pages;
      var _count = url_parts.count;
      var _skip = (_pages - 1) * _count;
      var _filtertext = url_parts.filtertext || "";
      var _category_id = url_parts.category_id || 0;
      if (!_pages) {
            console.log(url_parts);
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      if (_category_id == 0) {
            await pool.query(productqueries.GETPRODUCTSFORADMIN, [_count, _skip, _filtertext, _filtertext], (err, result) => {
                  if (err) {
                        console.log(err);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });

                  }
                  else {
                        return res.status(200).json({
                              success: true,
                              data: result.rows
                        });
                  }
            });
      } else {
            await pool.query(productqueries.GETPRODUCTSFORADMINBYCATID, [_count, _skip, _category_id, _filtertext, _filtertext], (err, result) => {
                  if (err) {
                        console.log(err);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });

                  }
                  else {
                        console.log(result.rowCount);
                        return res.status(200).json({
                              success: true,
                              data: result.rows
                        });
                  }
            });
      }
}
var getproductpages = async (req, res) => {
      var url_parts = url.parse(req.url, true).query;
      var _count = url_parts.count;
      var _category_id = url_parts.category_id || 0;
      var _filtertext = url_parts.filtertext || "";
      if (!_count) {
            console.log(url_parts);
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      if (_category_id == 0) {
            await pool.query(productqueries.GETPRODUCTCOUNT, [_filtertext, _filtertext], (err, result) => {
                  if (err) {
                        console.log(err);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });

                  }
                  else {

                        var count = result.rows[0].count / _count;
                        var pagesss = [];
                        if (Math.floor(count) < count) count += 1;
                        for (var i = 1; i <= count; i++) {
                              pagesss.push(i);
                        }

                        return res.status(200).json({
                              success: true,
                              data: pagesss
                        });
                  }
            });
      } else {
            await pool.query(productqueries.GETPRODUCTCOUNTBYID, [_category_id, _filtertext, _filtertext], (err, result) => {
                  if (err) {
                        console.log(err);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });

                  }
                  else {
                        var count = result.rows[0].count / _count;
                        var pagesss = [];
                        if (Math.floor(count) < count) count += 1;
                        for (var i = 1; i <= count; i++)pagesss.push(i);
                        return res.status(200).json({
                              success: true,
                              data: pagesss
                        });
                  }
            });
      }
}
var getproducts = async (req, res) => {
      //console.log(req.url);
      var _id = req.params.id;
      if (!_id) {
            // console.log(req.body);
            return res.status(400).json({
                  success: false,
                  msg: e.MsgTmFlags.INVALID_PARAMS,
            });
      }
      //console.log(productqueries.GETPRODUCT);
      await pool.query(productqueries.GETPRODUCT, [_id], (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(500).json({
                        success: false,
                        msg: e.MsgTmFlags.INVALID_PARAMS,
                  });
            }
            return res.status(200).json({
                  success: true,
                  data: result.rows[0],
            });
      });
}
var getProductIMAGES = async (req, res) => {
      var _id = req.params.id;
      if (!_id) {
            // console.log(req.body);
            return res.status(400).json({
                  success: false,
                  msg: e.MsgTmFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETPRODUCTIMAGES, [_id], (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            return res.status(200).json({
                  success: true,
                  data: result.rows,
            });
      });
}
var getProductdiscounts = async (req, res) => {
      var _id = req.params.id;
      if (!_id) {
            // console.log(req.body);
            return res.status(400).json({
                  success: false,
                  msg: e.MsgTmFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.GETPRODYCTDISCOUNTS, [_id], (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            return res.status(200).json({
                  success: true,
                  data: result.rows,
            });
      });
}
var updateprodductcount = async (req, res) => {
      var _id = req.body.id;
      var count = req.body.count;
      console.log(req.body);
      if (!_id || !count) {
            return res.status(400).json({
                  success: false,
                  msg: e.MsgTmFlags.INVALID_PARAMS,
            });
      }
      await pool.query(productqueries.CHACKCOUNT, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });
            }
            var image_url = result.rows[0].image_url;
            if (req.file) {
                  const imagePath = 'productcoloredimage';
                  var extention = "" + req.file.originalname;
                  //console.log(typeof(extention));
                  extention = extention.slice(extention.lastIndexOf('.'));
                  const fileUpload = new Resize(imagePath, Date.now() + extention);
                  fileUpload.setparams(100, 100);
                  const filename = await fileUpload.save(req.file.buffer);
                  image_url = fileUpload.fileURL();
            }
            const lengthofprotocol = (req.protocol + '://' + req.get('host') + "/").length;
            await pool.query(productqueries.UPDATEDISCOUNT, [_id, count, image_url], async (inserterr, insertresult) => {
                  if (inserterr) {
                        console.log(errq);
                        if (req.file) await utils.deleteServerFilePath(image_url, 0);
                        return res.status(500).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  if (req.file) await utils.deleteServerFilePath(result.rows[0].image_url, 0);
                  await roundproductcount(insertresult.rows[0].prod_id);
                  return res.status(200).json({
                        success: true,
                        data: insertresult.rows[0]

                  });
            });

      });
}
module.exports = {
      getallProducts,
      getProductByID,
      getSortedProducts,
      getFilterParametres,
      createProduct,
      addimagetoproduct,
      deleteproductimage,
      deleteProduct,
      addProductDiscount,
      deleteProductDiscount,
      getproductsadmin,
      getproductpages,
      getproducts,
      getProductIMAGES,
      getProductdiscounts,
      updateprodductcount,
      updateproductdatas,
      getFavorits,
      getbyseearchtext,
      getBigImages
}