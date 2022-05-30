const router=require('express').Router();
const controller=require('../controllers/sms_apps');

router.post('/public/sms-senders/register',controller.registerSMSApp)
router.delete('/public/sms-senders/unregister/:id',controller.unRegisterSmsApp);
module.exports = router