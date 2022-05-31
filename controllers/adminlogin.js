const pool = require('../db/db');
const e = require('../utils/e');
const webtoken = require('jsonwebtoken');
const sqlqueries = require('../sqlqueries/adminloginqueryes');
const settings = require('../settings/usersettings');

var checklogin = async (req, res) => {
    console.log(req.body);
    var username = req.body.userdata.username || "";
    var password = req.body.userdata.password || "";

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    pool.query(sqlqueries.CHECKLOGIN, [username, password], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (result.rowCount == 0) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.ERROR_AUTH
            });
        }
        try {
            var token = webtoken.sign({
                    user_id: result.rows[0].id,
                    username: result.rows[0].username
                }, settings.APISECRETKEY,
                {
                    expiresIn: '1000000h'
                });
        } catch (tockenerr) {
            console.log(tockenerr);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }

        console.log(token);
        return res.status(200).json({
            success: "ok",
            token: token
        });
    });
}
var getusers = async (req, res) => {

    var _namefilter = req.body.namefilter || "";
    var _numbetfilter = req.body.numberfilter || "";

    await pool.query(sqlqueries.GETUSERS, [_namefilter, _numbetfilter], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }

        return res.status(200).json({
            success: true,
            data: result.rows
        });

    });
}
var deleteuser = async (req, res) => {
    var _id = req.params.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(sqlqueries.DELETEUSER, [_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true
        });
    });
}
var getaboutdelails = async (req, res) => {
    await pool.query(sqlqueries.GETHABARLASHMAK, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if(result.rowCount){
            return res.status(200).json({
                success: true,
                data: result.rows
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "No data detected"
            });
        }
    });
}
var rules = async (req, res) => {
    await pool.query(sqlqueries.GETRULES, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows
        });
    });
}
var contactusdetails = async (req, res) => {
    await pool.query(sqlqueries.getcontactusadmin, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    })
}
var updatecontactdetails = async (req, res) => {
    var _tm_adress = req.body.tm_adress;
    var _ru_adress = req.body.ru_adress;
    var _mail = req.body.mail;
    var _tel_no = req.body.tel_no;
    if (!_tm_adress || !_ru_adress || !_mail || !_tel_no) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(sqlqueries.updatecuntactusdetails, [_tm_adress, _ru_adress, _tel_no, _mail], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    })
}
var getadminrules = async (req, res) => {
    await pool.query(sqlqueries.getallrulesforadmin, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows
        });
    })
}
var updaterule = async (req, res) => {
    var _id = req.params.id;
    var _tm_rule = req.body.tm_rule;
    var _ru_rule = req.body.ru_rule;
    if (!_id || !_tm_rule || !_ru_rule) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }

    await pool.query(sqlqueries.getforcheck, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        await pool.query(sqlqueries.updateruleadmin, [_id, _tm_rule, _ru_rule], (err1, result1) => {
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
var createrule = async (req, res) => {
    var _tm_rule = req.body.tm_rule;
    var _ru_rule = req.body.ru_rule;
    if (!_tm_rule || !_ru_rule) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(sqlqueries.insertrule, [_tm_rule, _ru_rule], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    });
}
var deleterule = async (req, res) => {
    var _id = req.params.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(sqlqueries.getforcheck, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        await pool.query(sqlqueries.deleterule, [_id], (err1, result1) => {
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
        })
    });
}
var registersmsap = async (req, res) => {
    var _tocken = req.body.token;
    if (!_tocken) {
        return res.status(400).json({
            success: false,
            message: "No token registred!"
        });
    }
    await pool.query(sqlqueries.getsmsapp, async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
        let _sql = "";
        if (result.rowCount == 0) {
            _sql = sqlqueries.createsmsapp;
        } else {
            _sql = sqlqueries.registersmsapp;
        }
        await pool.query(_sql, [_tocken], (err1, result1) => {
            if (err1) {
                console.log(err1);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
            return res.status(200).json(
                {
                    success: true,
                    message: "Sms applecation registered successfully!"
                }
            );
        });
    });
}
var getcounts = async (req, res) => {
    try {
        var countCat = await pool.query(sqlqueries.countcategories);
        var countPro = await pool.query(sqlqueries.countproducts);
        var countUsers = await pool.query(sqlqueries.countusers);
        var countBanners = await pool.query(sqlqueries.countbanners);
        return res.status(200).json({
            success: true,
            data: {
                catcount: countCat.rows[0].count,
                procount: countPro.rows[0].count,
                usercount: countUsers.rows[0].count,
                bancount: countBanners.rows[0].count,
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
        })
    }

}
var setprodsettings = async (req, res) => {
    let {elthyzmat,jemiarzan,adress,tel,email}=req.body;
    return  await pool.query(sqlqueries.UPDATE_STATIC_VAR,[elthyzmat,jemiarzan,adress,tel,email])
        .then(result=>{
            return res.status(200).json(
                {
                    success: true,
                    data:result.rows[0]
                }
            );
        }).catch(err=>{
            console.log(err)
          return  res.status(500).json({
              success: false,
              message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
          })
        })
}
var changePass = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(sqlqueries.CHANGEADMINDATAS, [username, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            success: true
        });
    });
}
module.exports = {
    checklogin,
    getusers,
    deleteuser,
    getaboutdelails,
    rules,
    updatecontactdetails,
    contactusdetails,
    createrule,
    updaterule,
    getadminrules,
    deleterule,
    registersmsap,
    getcounts,
    setprodsettings,
    changePass

}
