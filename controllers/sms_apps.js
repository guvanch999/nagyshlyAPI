const pool = require('../db/db')
const queries = require('../sqlqueries/sms_apps')
module.exports = {
    async registerSMSApp(req, res) {
        let data = req.body;
        if (!data.name || !data.device_token) {
            return res.status(400).json({
                success: false,
                message: "Invalid Params"
            })
        }
        return await pool.query(queries.REGISTER_SMS_APP, [data.name, data.device_token])
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: 1
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message:"Server problem"
                })
            })
    },
    async unRegisterSmsApp(req,res){
        let id=req.params.id;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Invalid Params"
            })
        }
        return await pool.query(queries.UN_REGISTER_SMS_APP)
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: 1
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message:"Server problem"
                })
            })
    }
}