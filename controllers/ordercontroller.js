const pool = require('../db/db');
const e = require('../utils/e');
const functions = require('../utils/functions');
const queries = require('../sqlqueries/orderqueries');
const url = require('url');
const admin = require('../utils/firebase-config');


var checkorders = async (req, res) => {
    var products = req.body.ids;
    console.log(req.body)
    if (!Array.isArray(products)) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    console.log(products)
    products.push(0)
    await pool.query(queries.SELECTPRODUCTS(products), async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
            });
        }
        res.status(200).json({
            success: true,
            data: result.rows
        });
    });
}
var getOrderSettings = async (req, res) => {
    await pool.query(queries.GETPRODUCTSETTINGS, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
            });
        }
        res.status(200).json({
            success: true,
            result: result.rows[0]
        });
    });
}
var makeOrder = async (req, res) => {
    var inrdata = functions.verifieOrderBody(req);
    var products = req.body.products;
    if (!inrdata || !Array.isArray(products)) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    let data = getDateTime();

    inrdata.unshift(req.user.user_id);
    var _peyment = req.body.payment_type;
    if (_peyment === undefined) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    inrdata.push(_peyment);
    inrdata.push(data)
    console.log(data)
    return await pool.query(queries.INSERTORDER, inrdata)
        .then(async result => {
            return await pool.query(queries.INSERTPRODUCTTOORDERS(products, result.rows[0].id))
        })
        .then(result => {
            return res.status(200).json({
                success: true
            });
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        })
}

var getOrders = async (req, res) => {
    await pool.query(queries.GETUSERSORDERS, [req.user.user_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
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
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(queries.GETORDERBYID, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
            });
        }
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INVALID_PARAMS,
            });
        }
        await pool.query(queries.GETORDERPRODUCTS, [_id], (perr, presult) => {
            if (perr) {
                console.log(perr);
                return res.status(400).json({
                    success: false,
                    msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
                });
            }
            var datafor = result.rows[0];
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
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    await pool.query(queries.GETORDERBYID, [_id], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
            });
        }
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INVALID_PARAMS,
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
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR,
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
    var _page = url_parts.page || 1;
    var _count = url_parts.count || 20;
    var _skip = url_parts.offset || 0;
    var _sort = url_parts.sort || "desc";
    var _filter = url_parts.filter || -1;
    if (!_page || !_count) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    return await pool.query(queries.getallorders(_sort, _filter), [_count, _skip])
        .then(async (result) => {
            let countResult = await pool.query(queries.getcountofall(_filter));
            return res.status(200)
                .json({
                    success: true,
                    data: result.rows,
                    count: countResult.rows[0].sany
                })
        }).then(async resData => {
            await pool.query(queries.makeisshown);
            return resData
        }).catch(err => {
            console.log(err)
            return res.status(500)
                .json({
                    success: false,
                    message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
                })
        })
}
var getnotshown = async (req, res) => {
    await pool.query(queries.getnotshown, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Internal server error!"
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0].count
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
        if (result.rowCount === 0) {
            return res.status(400).json({
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
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        //await sendmessage(result.rows[0].user_id, _status);
        if (_status === 'ACCEPTED') {
            try {
                let productIds = await pool.query(queries.getProductIds, [_id]);
                var ss = await pool.query(queries.returnorder(productIds.rows.map(x => x.product_id)), [_id]);
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

function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    if (day.toString().length === 1) {
        day = '0' + day;
    }
    if (hour.toString().length === 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length === 1) {
        minute = '0' + minute;
    }
    if (second.toString().length === 1) {
        second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
var smsmessages = [
    'Bagyşlaň. Siziň sargydyňyz kabul edilmedi!',
    'Siziň sargydyňyz kabul edildi! Bizi saýlanyňyz üçin köp sag boluň!'
]

async function sendmessage(id, status) {
    if (status === 'PENDING' || status === 'DELIVERED') return false;
    var registrationToken = "";
    try {
        var result = await pool.query(queries.getuser, [id])
        if (result.rowCount) {
            registrationToken = result.rows[0].f_tocken;
        } else return false;
    } catch (err) {
        console.log(err);
        return false;
    }
    const payload = {
        notification: {
            title: "Nagyşly",
            body: status === "ACCEPTED" ? smsmessages[1] : smsmessages[0],
        },
    };
    const options = notification_options;

    await admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(async (response) => {
            //console.log(response);
            //console.log(response.results[0]);
            if (response.successCount === 1) {
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

let getProductSellingRate = async (req, res) => {
    let {from_sene} = req.body;
    if (!from_sene) {
        return res.status(400).json({
            success: false,
            message: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    return await pool.query(queries.ACCEPTED_ORDERS, [from_sene])
        .then(async result => {
            let {rows}=await pool.query(queries.GET_ACCEPTED_ORDER_PRODUCTS(result.rows.map(x=>x.id).join(',')))
            let products=[];
            let tempProduct=null;
            for(let i=0;i<rows.length;i++){
                rows[i].buycount=parseInt(rows[i].buycount);
                if(!tempProduct){
                    tempProduct=rows[i]
                } else {
                    if(tempProduct.id===rows[i].id){
                        tempProduct.buycount=tempProduct.buycount+rows[i].buycount

                    } else {
                        products.push(tempProduct)
                        tempProduct=rows[i]
                    }
                }
            }
            if(tempProduct)products.push(tempProduct)
            products=products.sort((a,b)=>a.buycount<b.buycount?1:-1)
            return res.status(200).json({
                success: true,
                data: products
            });
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        })
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
    getnotshown,
    getProductSellingRate
}
