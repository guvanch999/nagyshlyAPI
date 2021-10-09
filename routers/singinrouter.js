const router=require('express').Router();
const controller=require('../controllers/singincontroller');


router.post('/postcode',controller.PostCode);
router.post('/verificode',controller.verificationCode);
router.post('/finish',controller.finishsingup);

module.exports=router;