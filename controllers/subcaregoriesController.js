const e = require('../utils/e');
const Resize = require('../midlewares/Resize');
const queries = require('../sqlqueries/subcategoriesQueries');
const pool = require('../db/db');
const functions = require('../utils/functions');
const productqueries = require('../sqlqueries/productqueries');

var addcategory = async (req, res) => {
    console.log(req.body)
    const tkm_name = req.body.tm_name;
    const rus_name = req.body.ru_name;
    const cat_id = req.body.cat_id;
    if (!tkm_name || !rus_name || !cat_id) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    try {

        var result = await pool.query(queries.INSERTCATEGORY, [cat_id, tkm_name, rus_name]);
        let category = await pool.query(queries.SELECTBYID, [cat_id]);
        let data=result.rows[0];
        data['categoryname']=category.rows[0].name
        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
        });
    }

}
let getAllSubcategories = async (req, res) => {
    return await pool.query(queries.SELECTALLSUBCATEGORIES)
        .then(result => {
            return res.status(200).json({
                success: true,
                count: result.rowCount,
                data: result.rows
            });
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        })
}
var getAllCategories = async (req, res) => {
    let _id = req.params.cat_id || 0
    if (!_id) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    try {
        var result = await pool.query(queries.SELECTALL, [_id]);
        return res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
        });
    }

}
var getCategoryByID = async (req, res) => {
    const _id = req.params.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    var result;
    try {
        result = await pool.query(queries.SELECTBYID, [_id]);
        if (!result.rowCount || result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: e.MsgTmFlags.INTERNAL_SERVER_ERROR
        });
    }


}
var searchcategrory = async (req, res) => {
    var _searchtext = req.body.searchtext || "";

    await pool.query(queries.SELECTBYSEARCHTEXT, [_searchtext], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            });
        }
        try {
            return res.status(200).json({
                success: true,
                data: result.rows
            });
        } catch (err1) {
            console.log(err1);
            return res.status(500).json({
                success: false,
                message: e.MsgTmFlags.INTERNAL_SERVER_ERROR
            })
        }

    });
}
var updateCategory = async (req, res) => {
    const _id = req.body.id;
    const _tm_name = req.body.tm_name;
    const _ru_name = req.body.ru_name;
    let cat_id = req.body.cat_id;
    if (!_id || !_tm_name || !_ru_name || !cat_id) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });

    }
    var result;
    try {
        result = await pool.query(queries.GETCATEGORYBYID, [_id]);
        if (!result.rowCount || result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        result = await pool.query(queries.UPDATECATEGORY, [_id, _tm_name, _ru_name, cat_id]);
        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }


}
var deleteCategory = async (req, res) => {
    const _id = req.params.id;
    if (!_id) {
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
    var result;
    try {
        result = await pool.query(queries.GETCATEGORYBYID, [_id]);
        if (!result.rowCount || result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                msg: e.MsgTmFlags.INVALID_PARAMS
            });
        }
        result = await pool.query(queries.GETPRODUCTIDS, [_id]);

        var data = result.rows;
        for (var i = 0; i < data.length; i++) {
            await deletefiles(data[i].id);
        }
        await pool.query(queries.DELSUBCATE, [_id])
        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            msg: e.MsgTmFlags.INVALID_PARAMS
        });
    }
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
                    } else {
                        return
                    }
                });
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
    searchcategrory,
    getAllSubcategories
}
