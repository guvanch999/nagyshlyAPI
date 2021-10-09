const pool = require('../db/db');
const e = require('../utils/e');
const crypto = require('crypto');
const queries = require('../sqlqueries/singinqueries');
const webtoken = require('jsonwebtoken');
const settings = require('../settings/usersettings');
const admin = require('../utils/firebase-config');
// getsmsapp:";",
const notification_options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
};
var PostCode = async (req, res) => {
      var _number = req.body.number;

      if (!_number || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      var sn = "";
      var registrationToken = "";
      try {
            var result = await pool.query("select fcm_tocken from users where tel_no='smsapp'");
            if (result.rowCount) {
                  registrationToken = result.rows[0].fcm_tocken;
            } else {
                  console.log("No sms app registred!");
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  })
            }
      } catch (err) {
            console.log(err);
            return res.status(500).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
            })
      }
      for (var i = 0; i < 5; i++) {
            sn += GETRANDOM();
      }
      const payload = {
            notification: {
                  title: _number,
                  body: sn,
            },
      };
      const options = notification_options;

      await admin.messaging().sendToDevice(registrationToken, payload, options)
            .then(async (response) => {
                  //console.log(response);
                  //console.log(response.results[0]);
                  if (response.successCount == 1) {
                        await pool.query(queries.INSERTNEWNUMBER, [_number, sn, Date.now() + 24 * 60 * 60 * 1000, "0"], (err, result) => {
                              if (err) {
                                    console.log(err);
                                    return res.status(400).json({
                                          success: false,
                                          msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                                    });
                              }
                              return res.status(200).json({
                                    success: true
                              });
                        });

                  } else {
                        return res.status(500).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                        });
                  }
            })
            .catch(error => {
                  console.log(error);
                  return res.status(500).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
                  });
            });
}

var verificationCode = async (req, res) => {
      var _number = req.body.number;
      var _code = req.body.code;
      if (!_code || !_number || !req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      await pool.query(queries.DELETEUPTIMEVERIF, [Date.now()], async (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                  });
            }

            await pool.query(queries.CHECKANDVERIFIE, [_number], async (err, result) => {
                  if (err) {
                        console.log(err);
                        return res.status(500).json({
                              success: false,
                              msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
                        });
                  }
                  if (result.rowCount == 0) {
                        return res.status(400).json({
                              success: false,
                              message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                        });
                  }
                  var rows = result.rows;
                  for (var i = 0; i < rows.length; i++) {
                        if (rows[i].ver_code == _code) {
                              return res.status(200).json({
                                    success: true
                              });
                        }
                  }

                  return res.status(400).json({
                        success: false,
                        message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
                  });

            });

      });

}
// var finishsingup = async (req, res) => {
//       var _number = req.body.number;
//       var _fullname = req.body.fullname;
//       var _fcmtocken = req.body.fcmtoken;
//       if (!_fcmtocken || !_fullname || !_number || !req.header('language')) {
//             return res.status(400).json({
//                   success: false,
//                   message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
//             });
//       }
//       // await pool.query(queries.CREATEUSER, [_number, _fullname,_fcmtocken], async (err, result) => {
//       //       if (err) {
//       //             console.log(err);
//       //             return res.status(400).json({
//       //                   success: false,
//       //                   msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
//       //             });
//       //       }
//       await pool.query(queries.DELETENUMBER, [_number], async (error, resss) => {
//             if (error) {
//                   console.log(err);
//                   return res.status(400).json({
//                         success: false,
//                         msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
//                   });
//             }
//             await pool.query(queries.SELECTQUERY, [_number], (thisusererr, thisuserresult) => {
//                   if (thisusererr) {
//                         console.log(thisusererr);
//                         return res.status(400).json({
//                               success: false,
//                               msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
//                         });
//                   }
//                   if (thisuserresult.rowCount == 0) {
//                         console.log(err);
//                         return res.status(400).json({
//                               success: false,
//                               msg: req.header('language') == 'tm' ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR,
//                         });
//                   }
//                   //console.log()
//                   var token = webtoken.sign({
//                         user_id: thisuserresult.rows[0].id,
//                         number: thisuserresult.rows[0].tel_no

//                   }, settings.APISECRETKEY,
//                         {
//                               expiresIn: '1000000h'
//                         });
//                   return res.status(200).json({
//                         success: true,
//                         token: token
//                   });

//             });


//       });

//       //  });

// }

var finishsingup = async (req, res) => {
      var _number = req.body.number;
      var _fullname = req.body.fullname;
      var _fcmtocken = req.body.fcmtoken;
      if (!req.header('language')) {
            return res.status(400).json({
                  success: false,
                  message: e.MsgTmFlags.INVALID_PARAMS
            });
      }
      if (!_fcmtocken || !_fullname || !_number) {
            return res.status(400).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS
            });
      }
      try {
            await pool.query(queries.DELETENUMBER, [_number]);
            var result = await pool.query(queries.UPDATEUSER, [_number, _fullname, _fcmtocken]);

            if (!result.rowCount) {
                  result = await pool.query(queries.CREATEUSER, [_number, _fullname, _fcmtocken]);
            }

            var token = webtoken.sign({
                  user_id: result.rows[0].id,
                  number: result.rows[0].tel_no

            }, settings.APISECRETKEY,
                  {
                        expiresIn: '1000000h'
                  });
            return res.status(200).json({
                  success: true,
                  token: token
            });

      } catch (err) {
            console.log(err);
            return res.status(500).json({
                  success: false,
                  message: req.header('language') == "tm" ? e.MsgTmFlags.INTERNAL_SERVER_ERROR : e.MsgRuFlags.INTERNAL_SERVER_ERROR
            });
      }

}




function GETRANDOM() {
      return crypto.randomInt(10);
}
module.exports = {
      PostCode,
      verificationCode,
      finishsingup,
}