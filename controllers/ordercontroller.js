const pool = require('../db/db');
const e = require('../utils/e');
const functions = require('../utils/functions');
const queries = require('../sqlqueries/orderqueries');
const url = require('url');
const admin = require('../utils/firebase-config');


var checkorders = async (req, res) => {
      var products = req.body;
      if (!Array.isArray(products) || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      //console.log(req.body);
      var ids = [0];
      products.forEach(element => {
            ids.push(element.id);
      });
      await pool.query(queries.SELECTPRODUCTS(req.header('language'), ids), async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            var resarray = result.rows;
            var finalresultdata = [];
            for (var j = 0; j < products.length; j++) {
                  var element = products[j];
                  for (var i = 0; i < resarray.length; i++) {
                        if (resarray[i].id == element.id) {
                              try {
                                    var rrr;
                                    if (element.defult == false) {
                                          //console.log(true);

                                          rrr = await pool.query(queries.GETPRODUCTDICOUNTBYCOLORANDSIZE(req.header('language')), [element.id, element.color_id, element.size]);
                                    } else {
                                          //console.log(false);
                                          rrr = await pool.query(queries.GETDEFAULTPRODUCT(req.header('language')), [element.id]);
                                    }
                                    if (rrr.rowCount > 0) {
                                          finalresultdata.push({
                                                id: resarray[i].id,
                                                tm_name: resarray[i].tm_name,
                                                ru_name: resarray[i].ru_name,
                                                image_url: resarray[i].image_url,
                                                price: resarray[i].price,
                                                new_price: resarray[i].new_price,
                                                filter_data_id: rrr.rows[0].id,
                                                color_id: rrr.rows[0].color_id,
                                                name: rrr.rows[0].name,
                                                code: rrr.rows[0].code,
                                                size: rrr.rows[0].size,
                                                count: rrr.rows[0].count,
                                          });
                                    }
                                    else {
                                          finalresultdata.push({
                                                id: resarray[i].id,
                                                tm_name: resarray[i].tm_name,
                                                ru_name: resarray[i].ru_name,
                                                image_url: resarray[i].image_url,
                                                price: resarray[i].price,
                                                new_price: resarray[i].new_price,
                                                filter_data_id: 0,
                                                color_id: null,
                                                name: null,
                                                code: null,
                                                size: null,
                                                count: 0,

                                          });
                                    }
                              }
                              catch (cerr) {
                                    console.log(cerr);
                                    return res.status(400).json({
                                          success: false,
                                          msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                                    });

                              }

                        }
                  }


            };
            res.status(200).json({
                  success: true,
                  result: finalresultdata
            });



      });


}
var getOrderSettings = async (req, res) => {
      if (!req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.GETPRODUCTSETTINGS, (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            res.status(200).json({
                  success: true,
                  result: result.rows[0]
            });
      });
}
var makeOrder = async (req, res) => {
      var verif = functions.verifieOrderBody(req);
      var products = req.body.products;
      if (!verif || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      var inrdata = [req.user.user_id];
      for (var i = 0; i < verif.length; i++)inrdata.push(verif[i]);
      //console.log(inrdata);
      await pool.query(queries.INSERTORDER, inrdata, async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }
            // console.log(result);
            for (var i = 0; i < products.length; i++) {
                  var element = products[i];
                  var data;
                  try {

                        var updresult = await pool.query(queries.UPDATE, [element.id, element.count]);
                        var re = await pool.query(queries.SELECTPRODUCTDETALS, [updresult.rows[0].prod_id]);
                        data = re.rows[0];
                        //await pool.query(queries.SELECT,[element.id]);

                        // console.log(rrr);
                        // // var data=rrr.rows[0];
                        await pool.query(queries.INSERTPRODUCTTOORDERS, [result.rows[0].id, data.tm_name, data.ru_name, data.price, data.new_price, element.count, data.image_url, element.id]);

                  } catch (prerr) {
                        console.log(prerr);
                        return res.status(500).json({
                              success: false,
                              msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                        });
                  }
            }

            res.status(200).json({
                  success: true
            });
      });

}
var getOrders = async (req, res) => {
      if (!req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.GETUSERSORDERS, [req.user.user_id], (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });

            }
            res.status(200).json({
                  success: true,
                  result: result.rows
            });
      });
}
var getorderbyid = async (req, res) => {
      var _id = req.params.id;
      if (!_id || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.GETORDERBYID, [_id], async (err, result) => {
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
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            await pool.query(queries.GETORDERPRODUCTS(req.header('language')), [_id], (perr, presult) => {
                  if (perr) {
                        console.log(perr);
                        return res.status(400).json({
                              success: false,
                              msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                        });
                  }
                  var datafor = result.rows[0];
                  var _dis = parseFloat(datafor.discount);
                  var _tot = parseFloat(datafor.asyl);
                  var jem = _tot * (_dis / 100);
                  datafor.discountprice = jem + "";
                  res.status(200).json({
                        success: true,
                        result: {
                              orderdetails: datafor,
                              orderproducts: presult.rows
                        }
                  });

            });
      });

}
var deleteOrder = async (req, res) => {
      var _id = req.params.id;
      if (!_id || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.GETORDERBYID, [_id], async (err, result) => {
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
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            try {
                  await pool.query(queries.DELETEORDERPRODUCTS, [_id]);
                  await pool.query(queries.DELETEORDER, [_id]);
                  res.status(200).json({
                        success: true,
                  });
            } catch (derr) {
                  console.log(derr);
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }
      });

}

var getadminorders = async (req, res) => {
      var _id = req.params.id;
      var url_parts = url.parse(req.url, true).query;
      var _page = url_parts.page;
      var _count = url_parts.count;
      var _skip = (_page - 1) * _count;
      if (!_id || !_page || !_count) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.getordersforadmin, [_id, _count, _skip], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                  });
            }
            await pool.query(queries.getordercount, [_id], (err1, result1) => {
                  if (err1) {
                        console.log(err1);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  var count = result1.rows[0].count / _count;
                  if (Math.floor(count) < count) count += 1;
                  count = Math.floor(count);

                  return res.status(200).json({
                        success: true,
                        data: result.rows,
                        pagecount: count
                  });
            });

      });
}

var getalladminorders = async (req, res) => {
      var url_parts = url.parse(req.url, true).query;
      var _page = url_parts.page;
      var _count = url_parts.count;
      var _skip = (_page - 1) * _count;
      var _sort = url_parts.sort || "desc";
      var _filter = url_parts.filter || -1;
      if (!_page || !_count) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.getallorders(_sort, _filter), [_count, _skip], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                  });
            }
            await pool.query(queries.makeisshown,async (errr,rrresult)=>{
                  if(errr){
                        console.log(errr);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });
                  }

                  await pool.query(queries.getcountofall(_sort, _filter), (err1, result1) => {
                        if (err1) {
                              console.log(err1);
                              return res.status(500).json({
                                    success: false,
                                    message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                              });
                        }
                        var count = result1.rows[0].count / _count;
                        if (Math.floor(count) < count) count += 1;
                        count = Math.floor(count);

                        return res.status(200).json({
                              success: true,
                              data: result.rows,
                              pagecount: count
                        });
                  });
            });
      });
}
var getnotshown=async  (req,res)=>{
      await  pool.query(queries.getnotshown,(err,result)=>{
            if(err){
                  console.log(err);
                  return res.status(500).json({
                        success:false,
                        message:"Internal server error!"
                  });
            }
            return  res.status(200).json({
                  success:true,
                  data:result.rows[0].count
            });
      })
}

var getorderproductsforadminaction = async (req, res) => {
      var _id = req.params.id;
      if (!_id) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.getforcheck, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INVALID_PARAMS
                  });
            }
            await pool.query(queries.getorderproductsforadmin, [_id], (err1, result1) => {
                  if (err1) {
                        console.log(err1);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  return res.status(200).json({
                        success: true,
                        data: result1.rows
                  });
            })
      });
}
var updatestatusaction = async (req, res) => {
      var _id = req.params.id;
      var _status = req.body.status;
      if (!_id || !_status) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.getforcheck, [_id], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                  });
            }
            if (result.rowCount == 0) {
                  return res.status(500).json({
                        success: false,
                        message: e.MsgTmFlags.INVALID_PARAMS
                  });
            }
            await sendmessage(result.rows[0].user_id, _status);
            if (_status == 1) {
                  try {
                        var ss = await pool.query(queries.returnorder, [_id]);
                  } catch (tryerr) {
                        console.log(tryerr);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });
                  }

            }
            await pool.query(queries.changestatus, [_id, _status], (err1, result1) => {
                  if (err1) {
                        console.log(err1);
                        return res.status(500).json({
                              success: false,
                              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                        });
                  }
                  return res.status(200).json({
                        success: true,
                        data: result1.rows[0]
                  });
            });
      });
}
const notification_options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
};
var smsmessages=[
      'Siziň sargydyňyz kabul edilmedi!',
      'Siziň sargydyňyz ýola düşdi!'
]
async function sendmessage(id, status) {
      if(status==0 || status==3) return false;
      var registrationToken = "";
      try {
            var result = await pool.query(queries.getuser, [id])
            if (result.rowCount) {
                  registrationToken = result.rows[0].fcm_tocken;
            } else return false;
      } catch (err) {
            console.log(err);
            return false;
      }
      const payload = {
            notification: {
                  title: "Aktaý",
                  body: smsmessages[status-1],
            },
      };
      const options = notification_options;

      await admin.messaging().sendToDevice(registrationToken, payload, options)
            .then(async (response) => {
                  //console.log(response);
                  //console.log(response.results[0]);
                  if (response.successCount == 1) {
                        console.log("sended");
                        console.log(registrationToken);
                        return true;
                  } else {
                        return false;
                  }
            })
            .catch(error => {
                  console.log(error);
                  return false;
                  
            });

}

module.exports = {
      checkorders,
      getOrderSettings,
      makeOrder,
      getOrders,
      getorderbyid,
      deleteOrder,
      getadminorders,
      getorderproductsforadminaction,
      updatestatusaction,
      getalladminorders,
      getnotshown
}
