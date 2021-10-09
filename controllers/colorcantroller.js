const e = require('../utils/e');
const pool = require('../db/db');
const colorqueries = require('../sqlqueries/colorqueries');


var getAllColors = async (req, res) => {

      try {
            var result = await pool.query(colorqueries.SELECTALL(req.header('language') + "_name"));
            return res.status(200).json({
                  success: true,
                  count: result.rowCount,
                  data: result.rows
            });

      } catch (err) {
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
}
var getColorByID = async (req, res) => {
      const _id = req.params.id;
      if (!_id) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      try {
            var result = await pool.query(colorqueries.SELECTBYID(req.header('language') + "_name"), [_id]);
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
var addColor = async (req, res) => {
      const _code = req.body.colorcode;
      const _tm_name = req.body.tm_name;
      const _ru_name = req.body.ru_name;
      //console.log(req.body);
      if (!_code || !_tm_name || !_ru_name) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });

      }
      try {
            var result =await pool.query(colorqueries.INSERTCOLOR, [_tm_name, _ru_name, _code]);
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
var updateColor = async (req, res) => {
      const _id = req.params.id;
      console.log(req.url);
      const _tm_name = req.body.tm_name;
      const _ru_name = req.body.ru_name;
      if (!_id || !_tm_name || !_ru_name) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      try {
            var result = await pool.query(colorqueries.SELECTBYID(req.header('language') + "_name"), [_id]);
            if (!result.rowCount || result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            console.log(result);
            result =await pool.query(colorqueries.UPDATECOLOR, [_id, _tm_name, _ru_name]);
            console.log(result);
            return res.status(200).json({
                  success: true,
                  data:result.rows[0]
            });
      } catch (err) {
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
}
var deleteColor = async (req, res) => {
      const _id = req.params.id;
      if (!_id) {
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
      try {
            var result = await pool.query(colorqueries.SELECTBYID(req.header('language') + "_name"), [_id]);
            if (!result.rowCount || result.rowCount == 0) {
                  return res.status(400).json({
                        success: false,
                        msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
                  });
            }
            result = await pool.query(colorqueries.GETPRODUCTIDS, [_id]);
            if (!result.rowCount || result.rowCount == 0) {

                  await pool.query(colorqueries.DELETECOLORQUERY, [_id]);
                  return res.status(200).json({
                        success: true
                  });
            } else {
                  await pool.query(colorqueries.MAKEDELETE, [_id]);
                  return res.status(200).json({
                        success: true
                  });
            }
      } catch (err) {
            console.log(err);
            return res.status(400).json({
                  success: false,
                  msg: req.header('language') == 'tm' ? e.MsgTmFlags.INVALID_PARAMS : e.MsgRuFlags.INVALID_PARAMS,
            });
      }
}

module.exports = {
      getAllColors,
      getColorByID,
      addColor,
      updateColor,
      deleteColor
}